var express = require('express')
var app = express()
var cloudCache = require('./src/cache.js')

app.set('port', (process.env.PORT || 8080))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.get('/pizzas', function(request, response) {
  response.send('<b>Lets Order Some Pizza <br/></b>'
				+ '-------------------------------'
				+ '<br/>'
				+ '<h3>types: plain, fancy</h3>'
				+ '<br/>'
				+ 'GET /orderPizza?email={emailId}&type={pizzaType}  - Order a pizza <br/>'
				+ 'GET /orders?email={emailId}               - get specific value <br/>')
})

app.get('/orderpizza', (request, response) => {
//   console.log('email: ' + request.query.email);
//   console.log('type: ' + request.query.type);
   var pizzaInFlight = createPizza(request.query.type); 
   console.log('pizza: ' + pizzaInFlight);
   cloudCache.addToCache(request.query.email, pizzaInFlight);
   response.send('Succesfully Placed Order For: ' + request.query.email); 
})

function createPizza( pizzaType) {
  var pizza;
  if (pizzaType.toString().trim() === 'plain') {
	pizza = {
           type: 'plain',
           toppings: ['cheese'],
           sauce: 'red'
        }
  } else if (pizzaType.toString().trim() === 'fancy') {
        pizza = {
           type: 'plain',
           toppings: ['cheese','chicken','arugula'],
           sauce: 'pesto'
        }
  }
  return pizza;
}


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
