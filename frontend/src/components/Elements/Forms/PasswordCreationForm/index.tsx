'use client'
import React, { useEffect, useState } from 'react'
import classes from './classes.module.scss'
import Link from 'next/link'
import { sanitize } from 'isomorphic-dompurify'
import {
  matchingPasswords,
  validatePasswordInput,
  validateUserNameInput,
} from '@/Services/validation'

import { getErrorMessage } from '@/Services/errorHandlingService'
import { useRouter } from 'next/navigation'
import Button from '@/components/Materials/Button'
import UserStore from '@/Stores/UserStore'
import AuthenticationApi from '@/api/BackComponents/AuthenticationApi'
import PasswordInput from '../../Inputs/PasswordInput'

export default function PasswordCreationForm() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [prePassword, setPrePassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [errors, setErrors] = useState<{ [key: string]: string }>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const userEmail = UserStore.getInstance().getEmail()
    setEmail(userEmail || '')
  }, [])

  async function sendPasswordCreationForm(e: { preventDefault: () => void }) {
    e.preventDefault()

    const sanitizedPrePassword = sanitize(prePassword.trim())
    const prePasswordErrors = validatePasswordInput(sanitizedPrePassword)
    const sanitizedUserName = sanitize(userName.trim())
    const userNameErrors = validateUserNameInput(sanitizedUserName)

    const matchingPassErrors = matchingPasswords(
      sanitizedPrePassword,
      password.trim(),
    )

    const formErrors = {
      ...prePasswordErrors,
      ...userNameErrors,
      ...matchingPassErrors,
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    const body = { userName: sanitizedUserName, email, password }

    try {
      setIsLoading(!isLoading)
      const response = await AuthenticationApi.getInstance().register(body)
      if (response) {
        setIsLoading(!isLoading)
        router.push('/login')
      }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = getErrorMessage(error)
      setErrors({ ...errors, form: errorMessage })
    }
  }

  function handlePrePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors({ ...errors, password: '' })
    setPrePassword(e.target.value)
  }
  function handlePasswords(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors({ ...errors, matchingPassword: '' })
    setPassword(e.target.value)
  }

  function handleUserName(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors({ ...errors, username: '' })
    setUserName(e.target.value)
  }

  function validatePassword(input: string) {
    const prePassWordErrors = validatePasswordInput(input)
    if (Object.keys(prePassWordErrors).length > 0) {
      setErrors(prePassWordErrors)
    }
  }

  function validateUserName(input: string) {
    const userNameErrors = validateUserNameInput(input)
    if (Object.keys(userNameErrors).length > 0) {
      setErrors(userNameErrors)
    }
  }

  return (
    <form className={classes['root']}>
      <div className={classes['form-element']}>
        <div className={classes['input-container']}>
          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            name="username"
            id="username"
            placeholder="Gabriel Attable"
            type="text"
            className={classes['username']}
            onChange={(e) => {
              validateUserName(e.target.value)
              handleUserName(e)
            }}
          />
          {errors && <div className={classes['error']}>{errors.username}</div>}
        </div>
        <div className={classes['input-container']}>
          <label htmlFor="password">Mot de passe</label>
          <PasswordInput
            onChange={(e) => {
              validatePassword(e.target.value)
              handlePrePassword(e)
            }}
            name="password"
            placeholder={'Entrez votre mot de passe'}
          />
          {errors && <div className={classes['error']}>{errors.password}</div>}
        </div>
        <div className={classes['input-container']}>
          <label htmlFor="password-confirmation">
            Confirmez votre mot de passe
          </label>
          <PasswordInput
            name="password-confirmation"
            id="password-confirmation"
            onChange={handlePasswords}
            placeholder={'Confirmez votre mot de passe'}
          />
          {errors && (
            <div className={classes['error']}>{errors.matchingPassword}</div>
          )}
        </div>
      </div>
      <div className={classes['button-container']}>
        <Button
          onClick={sendPasswordCreationForm}
          text={'Valider'}
          isLoading={isLoading}
          className={classes['connexion-button']}
        ></Button>
        {errors && <div className={classes['error']}>{errors.form}</div>}
        <Link
          href="/register"
          className={classes['registration-button-container']}
        >
          <button className={classes['registration-button']}>
            Vous souhaitez utiliser un autre email
          </button>
        </Link>
      </div>
    </form>
  )
}
