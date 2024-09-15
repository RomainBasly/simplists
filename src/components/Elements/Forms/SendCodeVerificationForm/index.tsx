'use client'
import { getErrorMessage } from '@/Services/errorHandlingService'
import { validateCodeInput } from '@/Services/validation'
import UserStore from '@/Stores/UserStore'
import EmailVerificationApi from '@/api/BackComponents/EmailVerificationApi'
import Button from '@/components/Materials/Button'
import { sanitize } from 'isomorphic-dompurify'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import classes from './classes.module.scss'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export default function SendCodeVerificationForm() {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')

  const [errors, setErrors] = useState<Record<string, string>>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const userEmail = UserStore.getInstance().getEmail()
    setEmail(userEmail || '')
  }, [])

  async function sendForm(e: { preventDefault: () => void }) {
    e.preventDefault()
    const sanitizedCode = sanitize(code.trim())
    const formErrors = validateCodeInput(sanitizedCode)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    // todo : voir si on peut pas penser à une autre manière de valider le code,
    // notamment l'email stored dans le local storage, tout en gardant la sécurité
    // au maximum
    const body = { email, code }

    try {
      setIsLoading(!isLoading)
      const response = await EmailVerificationApi.getInstance().sendVerificationCode(
        body,
      )
      if (response) {
        setIsLoading(!isLoading)
        router.push('/register/add-password')
      }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = getErrorMessage(error)
      setErrors({ ...errors, form: errorMessage })
    }
  }

  function handleCode(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors({ ...errors, code: '' })
    setCode(e.target.value)
  }

  return (
    <form className={classes['root']}>
      <div className={classes['content']}>
        <div className={classes['top']}>
          <div className={classes['email-icon']}>
            <EnvelopeIcon />
          </div>
          <div className={classes['text-container']}>
            Code de vérification envoyé à
            <span className={classes['bold-text']}> {email}</span>
          </div>
        </div>
        <div className={classes['input-container']}>
          <label htmlFor="code" className={classes['title']}>
            Veuillez indiquer votre code de vérification
          </label>
          <input
            type="text"
            id="code"
            className={classes['input']}
            onChange={handleCode}
            placeholder="Entrez votre code ici"
          />
          {errors && <div className={classes['error']}>{errors.form}</div>}
        </div>
        <div className={classes['buttons-container']}>
          <Button
            text="Valider"
            isLoading={isLoading}
            onClick={sendForm}
            className={classes['connexion-button']}
          />
        </div>
      </div>
    </form>
  )
}
