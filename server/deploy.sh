go build
git add .
git commit -m 'Deploying app'
git push heroku master
cd client
npm run deploy