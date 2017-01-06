#!/bin/bash

make

./thresholding 157 test/test1.png test/test1_1.png
echo "thresholding done"

./makedisk 2 test/disk.png
./erosion test/disk.png test/test1_1.png test/test1_2.png
./dilatation test/disk.png test/test1_2.png test/test1_2.png
echo "opening done"

./labeling test/test1_2.png test/test1_3.png test/test1_4.png

#./dilation test/disk-2.png test/test1_2.png test/test1_5.png
#./substract test/test1_5.png test/test1_2.png test/test1_5.png
#./add-boundary test/test1_5.png test/test1.png test/test1_6.png

#pvisu data/cell-res.png
