import * as Yup from 'yup'
import Clients from '../models/Clients'

class ClientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      number_service: Yup.string().required(),
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner })
    }

    const { name, number_service } = req.body

    const clientExists = await Clients.findOne({ where: { number_service } })

    if (clientExists) {
      return res.status(400).json({ error: 'Client already exists.' })
    }

    const client = await Clients.create({ name, number_service })

    return res.json(client)
  }

  async index(req, res) {
    const clients = await Clients.findAll()
    return res.json(clients)
  }

  async delete(req, res) {
    const { id } = req.params

    const client = await Clients.findByPk(id)

    if (!client) {
      return res.status(404).json({ error: 'Client not found.' })
    }

    await client.destroy()

    return res.status(204).send()
  }
}

export default new ClientController()
