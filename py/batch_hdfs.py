import datetime

import numpy as np
import ras_output_wse_timeseries
import pandas as pd
import geopandas as gpd
import os
from types import SimpleNamespace
import xarray as xr

df = pd.read_csv(r'Z:\js\ResMap\py\hdf_paths.csv', sep=',', header=0)
data_dir = r'Z:\js\ResMap\data\westPark'

# Open shp and make edits, output to geoJson data to be added as an invisible tooltip layer.
def make_tooltip_file(args):
    wse_gdf = gpd.read_file(os.path.join(args.postprocessingdirectory, args.forecastname, r'tempfiles\ras_wse.shp'))
    wse_gdf.to_crs(epsg=4326, inplace=True)
    # Compute depth as [max_wse - min_elev]
    wse_gdf['depth_max'] = wse_gdf['wse_max'] - wse_gdf['min_elev']
    wse_gdf['depth_max'] = wse_gdf['depth_max'].round(2)
    # Subset columns to elevation, wse_max and depth_max
    tooltip_gdf = wse_gdf[['geometry', 'min_elev', 'wse_max', 'depth_max']]
    # Subset to only rows with depth_max > 0
    tooltip_gdf = tooltip_gdf[tooltip_gdf['depth_max'] > 0]
    # Clip to wse_bounds
    wse_bounds_gdf = gpd.read_file(args.wse_bounds)
    tooltip_clip_gdf = gpd.clip(tooltip_gdf, wse_bounds_gdf) 
    # Export geoJson
    tooltip_dir = os.path.join(args.datadirectory, 'tooltip_layers')
    if not os.path.exists(tooltip_dir):
        os.makedirs(tooltip_dir)
    tooltip_clip_gdf.to_file(os.path.join(tooltip_dir, f'{args.forecastname}_tooltip.geojson'), driver='GeoJSON')

for index, row in df.iterrows():
    forecastName = row[0]
    hdf_filename = row[1]
    wse_bounds = row[2]
    args_dict =  {
        "file": hdf_filename,
        "points": r"Z:\js\ResMap\py\ts_points.txt",
        "postprocessingdirectory": r"Z:\js\ResMap\py\output",
        "datadirectory": data_dir,
        "output": "RAS_WSE_Timeseries.nc",
        "forecastname": forecastName,
        "wse_bounds": wse_bounds,
        "wkt": 'PROJCS["NAD_1983_StatePlane_Louisiana_North_FIPS_1701_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",3280833.333333333],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-92.5],PARAMETER["Standard_Parallel_1",31.16666666666667],PARAMETER["Standard_Parallel_2",32.66666666666666],PARAMETER["Latitude_Of_Origin",30.5],UNIT["Foot_US",0.3048006096012192],AUTHORITY["EPSG",3451]]',  
    }

    # SimpleNamespace is used to convert a dictionary to the same type as sysArgs would have.
    args = SimpleNamespace(**args_dict)

    # Create ras_wse.shp and timeseries.nc
    print (f'\nProcessing {forecastName}.')
    print ('Processing wse shp.')
    # ras_output_wse_timeseries.ras_output(args)

    # Create tooltip geoJson
    print ('Processing tooltip layer to geoJson.')
    # make_tooltip_file(args)

    # Create timeseries json
    print ('Processing timeseries to json.')
    
    #  Open points csv
    points_csv = pd.read_csv(args.points)

    # open nc file
    nc_file = os.path.join(args.postprocessingdirectory, args.forecastname, args.output)
    ds = xr.open_dataset(nc_file, decode_cf=False)

    # Create dataframes for times, values. Then , export Json.
    times = ds['time'].values
    for station in range(len(ds['values'])):
        
        #  Read point names from csv
        name = points_csv[points_csv['point_id'] == ds['point_id'][station].values].point_name.values[0]
    
        values = ds['values'][station].values

        # Create dataframe for times, values
        df = pd.DataFrame({'time': times, 'values': values})
        # From epoch time to date times, but need datetime function because year 3000 outside np.to_datetime range.
        df['datetime'] = df['time'].apply(lambda x: datetime.datetime.fromtimestamp(x).strftime('%Y-%m-%d %H:%M:%S'))
        df.drop(columns=['time'], inplace=True)
        df['values'].replace({-9999.0:np.NaN}, inplace=True)
        
        # convert to json
        json_file = os.path.join(args.datadirectory, 'timeseries', f'{name} timeseries.json')
        df.to_json(json_file, orient='records')