import { Router } from 'express'
import CategoryController from './controllers/CategoryController'
import ClientController from './controllers/ClientController'
import ItemController from './controllers/ItemController'
import SessionsController from './controllers/SessionsController'
import StockMovementsController from './controllers/StockMovementsController'

import authMiddlewares from './meddleawares/auth.js'
import UsersController from './controllers/UsersController.js'

const routes = new Router()
console.log('Routes file loaded')

// Defina suas rotas aqui
routes.get('/', (req, res) => {
  res.send('Hello World!')
})

routes.post('/sessions', SessionsController.store)

routes.post('/categories', CategoryController.store)
routes.get('/categories', CategoryController.index)
routes.delete('/categories/:id', CategoryController.delete)

routes.post('/clients', ClientController.store)
routes.get('/clients', ClientController.index)
routes.delete('/clients/:id', ClientController.delete)

routes.post('/users', UsersController.store)
routes.get('/users', UsersController.index)
routes.delete('/users/:id', UsersController.delete)

routes.post('/items', ItemController.store)
routes.get('/items', ItemController.index)
routes.put('/items/:id', ItemController.update)
routes.delete('/items/:id', ItemController.delete)
routes.get('/items/code/:code', ItemController.findByCode)

routes.post('/stock-movements', authMiddlewares, StockMovementsController.store)
routes.get('/stock-movements', authMiddlewares, StockMovementsController.index)

export default routes
