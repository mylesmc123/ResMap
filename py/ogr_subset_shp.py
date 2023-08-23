import os, glob, subprocess
def filterShapefilesWithOgr2Ogr(inputFolder, outputFolder, attributesToSave):

    # inputFolder: the folder where the original shapefiles are located
    # outputFolder: the folder where the filtered shapefiles are to be stored
    # attributesToSave: string of attributes that shall be copied into the output, e.g. 'ID, location', length'

    import subprocess

    # traverse through the input folder
    os.chdir(inputFolder)
    for filename in glob.glob('*.shp'):

        # filter each shapefile from the input folder and save it at output folder
        print('filtering ' + filename)
        subprocess.call(["ogr2ogr", "-f", "ESRI Shapefile", "-select", attributesToSave, outputFolder + '/' + filename, filename])

    return

if __name__ == '__main__':
    inputFolder = r"Z:\js\ResMap\py\output\May 2021\tempfiles"
    outputFolder = r"Z:\js\ResMap\py\output\May 2021\tempfiles\ogr"
    attributesToSave = "min_elev, wse_max"
    filterShapefilesWithOgr2Ogr(inputFolder, outputFolder, attributesToSave)