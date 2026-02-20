import { Router } from 'express'
import CategoryController from './app/controllers/CategoryController.js'
import ClientController from './app/controllers/ClientController.js'
import ItemController from './app/controllers/ItemController.js'
import SessionsController from './app/controllers/SessionsController.js'
import StockMovementsController from './app/controllers/StockMovementsController.js'

import authMiddlewares from './app/meddleawares/auth.js'
import UsersController from './app/controllers/UsersController.js'
import CategorySectionController from './app/controllers/CategorySectionController.js'

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

routes.post('/categories-section', CategorySectionController.store)
routes.get('/categories-section', CategorySectionController.index)
routes.delete('/categories-section/:id', CategorySectionController.delete)

routes.post('/clients', ClientController.store)
routes.get('/clients', ClientController.index)
routes.delete('/clients/:id', ClientController.delete)

routes.post('/users', UsersController.store)
routes.get('/users', UsersController.index)

routes.post('/items', ItemController.store)
routes.get('/items', ItemController.index)
routes.put('/items/:id', ItemController.update)
routes.delete('/items/:id', ItemController.delete)
routes.get('/items/code/:code', ItemController.findByCode)

routes.use(authMiddlewares)
routes.post('/stock-movements', StockMovementsController.store)
routes.get('/stock-movements', StockMovementsController.index)

routes.patch('/me', UsersController.updateMe)
routes.patch('/me/password', UsersController.updateMyPassword)

routes.patch('/users/:id', UsersController.updateOtherUser)
routes.delete('/users/:id', UsersController.delete)
export default routes
