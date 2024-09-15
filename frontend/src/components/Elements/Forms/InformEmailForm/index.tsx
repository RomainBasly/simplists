'use client'
import React, { useEffect, useState } from 'react'
import classes from '../LoginForm/classes.module.scss'
import Link from 'next/link'
import { sanitize } from 'isomorphic-dompurify'
import { validateEmailInput } from '@/Services/validation'
import EmailVerificationApi from '@/api/BackComponents/EmailVerificationApi'
import { getErrorMessage } from '@/Services/errorHandlingService'
import { useRouter } from 'next/navigation'
import Button from '@/components/Materials/Button'
import UserStore from '@/Stores/UserStore'

export default function InformEmailForm() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [errors, setErrors] = useState<{ [key: string]: string }>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function sendInformEmailForm(e: { preventDefault: () => void }) {
    e.preventDefault()

    const trimmedEmail = email.trim()
    const lowerCaseEmail = trimmedEmail.toLowerCase()
    const sanitizedEmail = sanitize(lowerCaseEmail)
    const formErrors = validateEmailInput(sanitizedEmail)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    const body = { email: lowerCaseEmail }

    try {
      setIsLoading(!isLoading)
      const response = await EmailVerificationApi.getInstance().sendVerificationEmail(
        body,
      )
      if (response) {
        setIsLoading(!isLoading)
        UserStore.getInstance().setEmail(sanitizedEmail)
        router.push('/register/verify-code')
      }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = getErrorMessage(error)
      setErrors({ ...errors, form: errorMessage })
    }
  }

  function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors({ ...errors, email: '' })
    setEmail(e.target.value)
  }
  return (
    <form className={classes['root']}>
      <div className={classes['form-element']}>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          id="email"
          placeholder="gabriel@attable.com"
          onChange={handleEmail}
          className={classes['input']}
        />
        {errors && <div className={classes['error']}>{errors.email}</div>}
      </div>
      <div className={classes['button-container']}>
        <Button
          onClick={sendInformEmailForm}
          text={"S'enregistrer"}
          isLoading={isLoading}
          className={classes['connexion-button']}
        ></Button>
        {errors && <div className={classes['error']}>{errors.form}</div>}
        <Link
          href="/login"
          className={classes['registration-button-container']}
        >
          <button className={classes['registration-button']}>
            Vous avez déjà un compte? Connectez-vous
          </button>
        </Link>
      </div>
    </form>
  )
}
