npm i
npm run build:test
app_name=hkt_web_pc
version=v1
image_name=$app_name:$version
docker stop $app_name
docker rm $app_name
docker rmi -f $image_name
docker build -t $image_name .
docker run  -p 8081:80 --name $app_name $image_name  
# echo 'run on http://192.168.5.38:8081 http://localhost:8081'