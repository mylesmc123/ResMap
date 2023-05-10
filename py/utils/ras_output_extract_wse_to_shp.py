#*************************************************************************************
#-------This script exports 2D Flow area polygons & WSE results for each Timestep
#-------Cross-section (XS) polylines and WSE results are also exported to shapefile
#-------HDF format must be developed from Hec-RAS 6.0 Beta 3---------------------


import os
import shutil

import numpy as np
import h5py
import shapefile
import time
# from osgeo import ogr, gdal, osr
from osgeo import ogr
# import geopandas as gpd

# import utils.ras_output_wse_shp_to_nc

#-------------Delete Temp Directory--------
def tempDirSweep(tempDir):
    if not os.path.exists(tempDir):
        os.makedirs(tempDir)

    for f in os.listdir(tempDir):
        file_object_path = os.path.join(tempDir, f)
        if os.path.isfile(file_object_path):
            os.unlink(file_object_path)
        else:
            shutil.rmtree(file_object_path)
    return None
#------------------------------------------

#******Create/Sweep temp folder***
# tempDirSweep(tempDir)
#***********************************

# Simply gets the names of the 2D Flow Areas in the Plan's geometry
def get2DAreaNames(hf):
    hdf2DFlow = hf['Results']['Unsteady']['Geometry Info']['2D Area(s)']
    AreaNames = []
    for key in hdf2DFlow:
        if key in ['Cell Spacing', "Manning's n", 'Names', 'Tolerances']:
            continue
        else:
            AreaNames.append(key)  # List of 2D Area names
    return AreaNames


def get2DArea_cellcenter_pts(curr_2DArea, hf):
    hdf2DFlow_geo = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DFlow_geo[curr_2DArea]['Cells Center Coordinate']
    data_list = np.zeros((2,), dtype='float64')
    data_list = np.array(dataset).tolist()
    # print(data_list)
    return data_list


def get2DCells_min_elev(curr_2DArea, hf):
    hdf2DFlow_geo = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DFlow_geo[curr_2DArea]['Cells Minimum Elevation']
    # print (dataset)
    #data_list = np.zeros([1, ], dtype='float64')
    data_list = np.array(dataset).tolist()
    return data_list


def get2DArea_wse_data(curr_2DArea, hf):
    hdf2DFlow_wse_data = hf['Results']['Unsteady']['Output']['Output Blocks'] \
        ['Base Output']['Unsteady Time Series']['2D Flow Areas']

    dataset = hdf2DFlow_wse_data[curr_2DArea]['Water Surface']

    # data_list = np.zeros((timesteps,), dtype='float64')
    # dataset.read_direct(data_list, np.s_[0:timesteps,], np.s_[0:timesteps])
    data_list = np.array(dataset).tolist()

    return data_list


def get_timesteps(hf):
    hdf_timesteps = hf['Results']['Unsteady']['Output']['Output Blocks']['Base Output'] \
        ['Unsteady Time Series']['Time']
    timesteps = hdf_timesteps.shape[0]
    return timesteps


def getXSAttributes(hf):
    hdfXSAttributes = hf['Geometry']['Cross Sections']['Attributes']
    XSAttributes = []
    for key in hdfXSAttributes:
        if key in ['Cell Spacing', "Manning's n", 'Names', 'Tolerances']:
            continue
        else:
            XSAttributes.append(key)  # List of 2D Area names
    return XSAttributes


def get_FacePoints_Coordinates(hf, curr_2DArea):
    hdf2DFacePoints_Coordinates = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DFacePoints_Coordinates[curr_2DArea]['FacePoints Coordinate']
    data_list = np.array(dataset).tolist()
    return data_list


def get_Cells_Face_Info(hf, curr_2DArea):
    hdf2DCell_Face_Info = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DCell_Face_Info[curr_2DArea]['Cells Face and Orientation Info']
    data_list = np.array(dataset).tolist()
    return data_list


def get_Cells_FacePoints_Index(hf, curr_2DArea):
    hdf2DCell_Face_Index = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DCell_Face_Index[curr_2DArea]['Cells FacePoint Indexes']
    data_list = np.array(dataset).tolist()
    return data_list


def is_FacePoint_perimeter(hf, curr_2DArea):
    hdf2DCell_Face_is_perimeter = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DCell_Face_is_perimeter[curr_2DArea]['FacePoints Is Perimeter']
    data_list = np.array(dataset).tolist()
    return data_list


def get_faces_FacePoint_Index (hf, curr_2DArea):
    hdf2DCell = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DCell[curr_2DArea]['Faces FacePoint Indexes']
    data_list = np.array(dataset).tolist()
    return data_list


def get_faces_Perimeter_Info (hf, curr_2DArea):
    hdf2DCell = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DCell[curr_2DArea]['Faces Perimeter Info']
    data_list = np.array(dataset).tolist()
    return data_list


def get_faces_Perimeter_Values (hf, curr_2DArea):
    hdf2DCell = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DCell[curr_2DArea]['Faces Perimeter Values']
    data_list = np.array(dataset).tolist()
    return data_list


def get_face_orientation_info (hf, curr_2DArea):
    hdf2DCell = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DCell[curr_2DArea]['Cells Face and Orientation Info']
    data_list = np.array(dataset).tolist()
    return data_list


def get_face_orientation_values (hf, curr_2DArea):
    hdf2DCell = hf['Geometry']['2D Flow Areas']
    dataset = hdf2DCell[curr_2DArea]['Cells Face and Orientation Values']
    data_list = np.array(dataset).tolist()
    return data_list


# #***************************Open HDF5 file and get 2DArea Names, Timestep
# hf = h5py.File(hdf_filename, 'r')
# list_of_2DAreas = get2DAreaNames(hf)
# timesteps = get_timesteps(hf)
# all_data = np.empty((0, timesteps + 6), ) # Includes an extra wse column for maximum row value

# #Initialize shapefile of all 2D flow cells
# poly_wse_shp = os.path.join(tempDir, 'ras_wse.shp')
# w = shapefile.Writer(poly_wse_shp)

# # ***********Begin writing to polygon shapefile using rows of cell index pts
# # w = shapefile.Writer('test_polygon_all_data')   <-------- Currently  initialize outside of 2DArea loop
# # Start writing to Shapefile
# # Writing field names and types
# # "C": Characters, text.
# # "N": Numbers, with or without decimals.
# # "F": Floats(same as "N").
# # "L": Logical, for boolean True / False values.
# # "D": Dates.
# # "M": Memo
# w.field('Area2D', 'C')
# w.field('Cell_Index', 'N')
# w.field('Easting', 'N', decimal=2)
# w.field('Northing', 'N', decimal=2)
# w.field('min_elev', 'N', decimal=2)

# #Creating Results fields, same number as timesteps
# i = 0
# while i < timesteps:
#     w.field('wse_' + str(i), 'N', decimal=2)
#     i += 1
# # Shapefile is closed after 2DArea loop

# #Add a wse for maximum water surface at end
# w.field('wse_max', 'N', decimal=2)


# #Loop through all 2D flow areas in HDF file and extract geometry pts and results
# for curr_2DArea in list_of_2DAreas:
#     print("Current 2D Area is: %s" % curr_2DArea)

#     xy_pts = np.array(get2DArea_cellcenter_pts(curr_2DArea))
#     min_elev = np.array(get2DCells_min_elev(curr_2DArea)).round(decimals=2)
#     # transpose_min_elev = min_elev.T

#     wse_data = np.array(get2DArea_wse_data(curr_2DArea))
#     transpose_wse = wse_data.T.round(decimals=2)

#     #Find WSE values that are equal to cell min elev, set to NaN, all others set to 1
#     repeats_cell_min_elev = np.tile(min_elev, (timesteps,1)).T
#     cell_depths = transpose_wse - repeats_cell_min_elev
#     cell_depths[cell_depths > 0] = 1
#     cell_depths[cell_depths == 0] = 0

#     #Remove zero depth values
#     filtered_transpose_wse = cell_depths * transpose_wse
#     filtered_transpose_wse[filtered_transpose_wse==0] = -9999
#     filtered_transpose_wse.round(decimals=2)
#     max_of_row = np.max(filtered_transpose_wse, axis=1)

#     cell_index = np.arange(xy_pts.shape[0])
#     curr_2DArea_index = [curr_2DArea.decode('UTF-8')]* (xy_pts.shape[0])

#     #Adding columns to results array
#     all_data_for_curr_2DArea = np.column_stack((curr_2DArea_index,cell_index, xy_pts, min_elev))
#     all_data_for_curr_2DArea = np.concatenate((all_data_for_curr_2DArea, filtered_transpose_wse), axis=1)
#     all_data_for_curr_2DArea = np.column_stack((all_data_for_curr_2DArea, max_of_row))

#     #Save into the overall dataset
#     all_data = np.append(all_data, all_data_for_curr_2DArea, axis=0)

#     # Assemble 2D Cell Polygons
#     cell_face_info = get_Cells_Face_Info(hf, curr_2DArea)
#     cell_face_xy_pts = get_FacePoints_Coordinates(hf, curr_2DArea)
#     cell_face_index_pts = get_Cells_FacePoints_Index(hf, curr_2DArea)

#     #Assemble info about perimeter faces and facepoints
#     cell_facept_is_perimeter = is_FacePoint_perimeter(hf, curr_2DArea)
#     face_facept_index = get_faces_FacePoint_Index(hf, curr_2DArea)
#     face_perimeter_info = get_faces_Perimeter_Info(hf, curr_2DArea)
#     face_perimeter_values = get_faces_Perimeter_Values(hf, curr_2DArea)
#     face_orientation_info = get_face_orientation_info(hf, curr_2DArea)
#     face_orientation_values = get_face_orientation_values(hf, curr_2DArea)

#     #Assemble current polygons
#     cell_ids = []
#     index_size = len(cell_face_index_pts[0])
#     curr_2DArea_Polygon_xy_pts = []
#     cell_id = 0
#     cell_ids = []
#     for row in cell_face_index_pts:
#         #find if facepoints are perimeter
#         perimeter_facepts = []
        
#         for facept in row:
            
#             if facept != -1:

#                 if cell_facept_is_perimeter[facept] == -1:
#                     perimeter_facepts.append(facept)
#         #print(perimeter_facepts)

#         #Declare empty polygon list for 2D cell
#         polygon = []
#         i = 0
#         while i < index_size:
#             curr_facept = row[i]
            
#             if curr_facept != -1:
#                 polygon.append(cell_face_xy_pts[curr_facept])

#             if i < (index_size -1) :
#                 next_facept = row[i+1]

#             if i == (index_size -1):
#                 next_facept = row[0]


#             if curr_facept in perimeter_facepts:
                
#                 if next_facept in perimeter_facepts:
#                     face_index=0
                    
#                     for face in face_facept_index:
#                         if curr_facept == face_facept_index[face_index][0]:
#                             potential_face = face_index
                            
#                             if next_facept == face_facept_index[potential_face][1]:
#                                 next_is_first = False
#                                 curr_face_index = face_index
#                                 # print("found face")
#                                 break

#                         if next_facept == face_facept_index[face_index][0]:
#                             potential_face = face_index
                            
#                             if curr_facept == face_facept_index[potential_face][1]:
#                                 next_is_first = True
#                                 curr_face_index = face_index
#                                 # print("found face")
#                                 break

#                         face_index +=1


#                     perimeter_st_pt = face_perimeter_info[curr_face_index][0]
#                     num_perimeter_pts = face_perimeter_info[curr_face_index][1]
#                     perimeter_end_pt = perimeter_st_pt + num_perimeter_pts - 1
#                     perimeter_pt_index = perimeter_st_pt

#                     extra_perimeter_xy_pts = []

#                     # print("...adding perimeter pts, for face %s" % curr_face_index )
#                     while perimeter_pt_index <= perimeter_end_pt:
#                         # polygon.append(face_perimeter_values[perimeter_pt_index])
#                         extra_perimeter_xy_pts.append(face_perimeter_values[perimeter_pt_index])
#                         perimeter_pt_index += 1

#                     if next_is_first:
#                         extra_perimeter_xy_pts = extra_perimeter_xy_pts[::-1]

#                     polygon.extend(extra_perimeter_xy_pts)
#                 #polygon.append(cell_face_xy_pts[next_facept])

#             i += 1

#         #Append the first face pt coordinate
#         polygon.append(cell_face_xy_pts[row[0]])

#         #Append to the total 2D Area set if more than 2 points (there are some lateral weirs represented like this)
#         if sum(1 for n in row if n != -1)>=3:
#             curr_2DArea_Polygon_xy_pts.append(polygon)
#             #Keep track of cell_ids that make it into the polygon set
#             cell_ids.append(cell_id)

#         cell_id += 1

#     #--------------Saving polygons and records to shapefile-------------
#     print ("writing %s polygons to shapefile..." %curr_2DArea.decode('UTF-8'))
#     str_curr_2DArea = curr_2DArea.decode('UTF-8')
    
#     for row_id, poly_row in enumerate(curr_2DArea_Polygon_xy_pts):
        
#         if len(poly_row) > 2:
#             w.poly([poly_row[::-1]]) #clockwise flip
#             #w.record(INT=nr, LOWPREC=nr, MEDPREC=nr, HIGH)
#             #w.record(Area2D=str_curr_2DArea,Cell_Index=cell_id, Easting=all_data_for_curr_2DArea[cell_id][])
#             #w.record('Area2D', str_curr_2DArea)
#             #w.record('Cell Index', cell_id)
#             records = np.array(all_data_for_curr_2DArea[cell_ids[row_id]]).tolist()
#             w.record(*records)

# #Close 2DArea polygon shapefile
# print("Closing shapefile with all 2D Area polygons.")
# w.close()

# print("Writing Projection file w/ hardcoded coordinate system.")
# with open(os.path.join(tempDir,'polygon_all_data.prj'), 'w') as f:
#     f.write(coord_sys)
#     f.close()

#********************************Buffer to fix self-intersections*********************************
def createBuffer(inputfn, outputBufferfn, bufferDist):
    inputds = ogr.Open(inputfn)
    inputlyr = inputds.GetLayer()

    shpdriver = ogr.GetDriverByName('ESRI Shapefile')
    
    if os.path.exists(outputBufferfn):
        shpdriver.DeleteDataSource(outputBufferfn)
    
    outputBufferds = shpdriver.CreateDataSource(outputBufferfn)
    bufferlyr = outputBufferds.CreateLayer(outputBufferfn, geom_type=ogr.wkbPolygon)
    featureDefn = bufferlyr.GetLayerDefn()

    for feature in inputlyr:
        ingeom = feature.GetGeometryRef()
        geomBuffer = ingeom.Buffer(bufferDist)
        outFeature = ogr.Feature(featureDefn)
        outFeature.SetGeometry(geomBuffer)
        bufferlyr.CreateFeature(outFeature)
        outFeature = None

    inputds = None
    inputlyr = None


#***************************************Fix self intersections*********************************************
# print('Buffering 2D Area polygon shapefile by small amount to remove self-intersections and slivers...')

# poly_wse_shp_buffer = os.path.join(tempDir, 'test_polygon_all_data_buffer.shp')
# createBuffer(poly_wse_shp, poly_wse_shp_buffer, 5)

# print("Writing Projection file w/ hardcoded coordinate system.")

# with open(os.path.join(tempDir,'test_polygon_all_data_buffer.prj'), 'w') as f:
#     f.write(coord_sys)
#     f.close()

# # Open shp as geoPandas Dataframe and change the crs to 4326.
# wse_gpd = gpd.read_file(poly_wse_shp)


#*************************************************************************************************
#-----------------------------Loop through and get XS Polylines and Results-----------------------
#*************************************************************************************************
def get_XS_names (hf):
    try:
        dfXS_geo = hf['Geometry']['Cross Sections']['Attributes']
        dataset = dfXS_geo
        # print (dataset)
        # data_list = np.zeros([1, ], dtype='float64')
        data_list = np.array(dataset).tolist()
        return data_list
    except:
        print ("XS_names not found in hdf file.")
        return None


def get_XS_polyline_info (hf):
    
    try:
        dfXS_geo = hf['Geometry']['Cross Sections']['Polyline Info']
        dataset = dfXS_geo
        # print (dataset)
        # data_list = np.zeros([1, ], dtype='float64')
        data_list = np.array(dataset).tolist()
        return data_list
    
    except:
        print ("XS_polyline_info not found in hdf file.")
        return None

def get_XS_polyline_points (hf):
    
    try:
        dfXS_geo = hf['Geometry']['Cross Sections']['Polyline Points']
        dataset = dfXS_geo
        # print (dataset)
        # data_list = np.zeros([1, ], dtype='float64')
        data_list = np.array(dataset).tolist()
        return data_list
    
    except:
        print ("XS_polyline_points not found in hdf file.")
        return None

def get_XS_wse_results (hf):
    
    try:
        dfXS_results = hf['Results']['Unsteady']['Output']['Output Blocks'] \
            ['Base Output']['Unsteady Time Series']['Cross Sections']['Water Surface']
        dataset = dfXS_results
        # print (dataset)
        # data_list = np.zeros([1, ], dtype='float64')
        data_list = np.array(dataset).tolist()
        return data_list
    
    except:
        print ("XS_wse_results not found in hdf file.")
        return None

def clip_shapefile(inputDS, clipDS, outputDS, geom, coord_sys):

    ## Input
    driverName = "ESRI Shapefile"
    driver = ogr.GetDriverByName(driverName)
    inDataSource = driver.Open(inputDS, 0)
    inLayer = inDataSource.GetLayer()

    print(inLayer.GetFeatureCount())
    ## Clip
    inClipSource = driver.Open(clipDS, 0)
    inClipLayer = inClipSource.GetLayer()
    print(inClipLayer.GetFeatureCount())

    ## Clipped Shapefile... Maybe???
    outDataSource = driver.CreateDataSource(outputDS)

    if geom == 'polygon':
        outLayer = outDataSource.CreateLayer('FINAL', geom_type=ogr.wkbMultiPolygon)
    
    if geom == 'polyline':
        outLayer = outDataSource.CreateLayer('FINAL', geom_type=ogr.wkbMultiLineString)

    print("Writing Projection file w/ hardcoded coordinate system.")
    outputDS_path = os.path.dirname(outputDS)
    outputDS_base = os.path.split(os.path.splitext(outputDS)[0])[1]
    
    with open(os.path.join(outputDS_path, outputDS_base +'.prj'), 'w') as f:
        f.write(coord_sys)
        f.close()

    ogr.Layer.Clip(inLayer, inClipLayer, outLayer)
    print(outLayer.GetFeatureCount())
    inDataSource.Destroy()
    inClipSource.Destroy()
    outDataSource.Destroy()

