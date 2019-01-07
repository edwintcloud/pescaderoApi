const prod = process.env.NODE_ENV === 'production'

module.exports = {
  'process.env.BACKEND_URL': prod ? 'https://myapp.herokuapp.com' : 'http://localhost:5000',
  'process.env.GOOGLE_MAPS_URL': 'https://maps.googleapis.com/maps/api/js?key=mykey=3.exp&libraries=geometry,drawing,places',
  'process.env.PHOTO_API_URL': 'https://avatarmate.herokuapp.com/api/v1/avatars',
  'process.env.PHOTO_API_KEY': 'apikey'
};