import { v4 } from 'uuid'
import validator from 'validator'

import * as Yup from 'yup'
import Users from '../models/Users.js'

// Função de sanitização reutilizável
const sanitizeInput = (data) => {
  const sanitizedData = {}
  Object.keys(data).forEach((key) => {
    sanitizedData[key] =
      typeof data[key] === 'string' ? validator.escape(data[key]) : data[key]
  })
  return sanitizedData
}

class UsersController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      role: Yup.string().oneOf(['admin', 'user']).required(),
      update_number: Yup.string().optional(),
    })

    const sanitizedBody = sanitizeInput(request.body)

    try {
      await schema.validateSync(sanitizedBody, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name, email, password, role, update_number } = sanitizedBody

    const emailUserExists = await Users.findOne({
      where: { email },
    })

    const nameUserExists = await Users.findOne({
      where: { name },
    })

    if (emailUserExists) {
      return response.status(409).json({ error: 'Email user already exists' })
    }

    if (nameUserExists) {
      return response.status(409).json({ error: 'Name user already exists' })
    }

    await Users.create({
      id: v4(),
      name,
      email,
      password,
      role,
      update_number,
    })

    return response.status(201).json({ message: 'User created successfully' })
  }

  async index(request, response) {
    const listExercices = await Users.findAll()
    return response.json(listExercices)
  }

  async updateMe(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      email: Yup.string().email(),
    })

    await schema.validate(request.body)

    const user = await Users.findByPk(request.userId)
    if (!user) return response.status(404).json({ error: 'User not found' })

    Object.assign(user, request.body)
    await user.save()

    return response.json({ message: 'Profile updated' })
  }

  async updateMyPassword(request, response) {
    const schema = Yup.object({
      oldPassword: Yup.string().required(),
      password: Yup.string().min(6).required(),
    })

    await schema.validate(request.body)

    const user = await Users.findByPk(request.userId)

    if (!(await user.checkPassword(request.body.oldPassword))) {
      return response.status(401).json({ error: 'Wrong password' })
    }

    user.password = request.body.password
    await user.save()

    return response.json({ message: 'Password updated' })
  }

  async updateOtherUser(req, response) {
    const { id } = req.params

    const user = await Users.findByPk(id)
    if (!user) return response.status(404).json({ error: 'User not found' })

    Object.assign(user, req.body)
    await user.save()

    return response.json({ message: 'User updated by admin' })
  }

  async delete(request, res) {
    const { id } = request.params

    const user = await Users.findByPk(id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    await user.destroy()
    return res.json({ message: 'User deleted' })
  }
}

export default new UsersController()
