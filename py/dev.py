from utils.ras_output_wse_shp_to_nc import wse_shp_to_nc

hdf_filename = 'S:\\For_Myles\\WestPark\\HEC-RASV6.3.1\\WestPark.p11.hdf'
hdf_interval = '30MIN'
hdf_starttime = '01Jan3000 00:00:00'
poly_wse_shp = 'Z:\\js\\ResMap\\py\\output\\2yr Existing\\tempfiles\\ras_wse.shp'
stations_locations_txt = 'Z:\\js\\ResMap\\py\\ts_points.txt'
output_nc = 'Z:\\js\\ResMap\\py\\output\\2yr Existing\\RAS_WSE_Timeseries.nc'


wse_shp_to_nc(poly_wse_shp, stations_locations_txt, hdf_filename, output_nc)