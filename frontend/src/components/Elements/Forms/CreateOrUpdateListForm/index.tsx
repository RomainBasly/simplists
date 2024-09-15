'use client'
import classes from './classes.module.scss'
import { useState, useEffect, useCallback } from 'react'
import {
  validateCreateListForm,
  validateEditEmails,
  validateEditListForm,
  validateEmailInput,
} from '@/Services/validation'
import { getErrorMessage } from '@/Services/errorHandlingService'
import { useRouter } from 'next/navigation'
import Button from '@/components/Materials/Button'
import {
  UserPlusIcon,
  EyeSlashIcon,
  ShareIcon,
  ChevronRightIcon,
  UserMinusIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { sanitize } from 'isomorphic-dompurify'
import CustomSelector from '@/components/Materials/CustomSelector'
import classnames from 'classnames'
import classNames from 'classnames'
import { useCheckAccessTokenHealth } from '@/components/Utils/checkAccessTokenHealth'

export interface Body {
  listName: string
  invitedEmails: string[]
  thematic: string
  accessLevel: string
  description: string
  cyphered: boolean
  beneficiaryEmails: string[]
}

interface EditListProps {
  mode: 'create' | 'edit'
  initialData?: IListContent
}

export type IListContent = {
  id: string
  listName: string
  thematic: string
  description: string
  access_level: string
  beneficiaries: IBeneficiary[]
  invitedEmails: IInvited[]
}

export type IBeneficiary = {
  'app-users': IUser
}

export type IUser = {
  email: string
  user_id: string
}

export type IInvited = {
  email: string
  status: number | string
}

export function CreateOrUpdateListForm(props: EditListProps) {
  // InitialData Allows later to compare what has been changed in the edit form
  // Todo later : trying to refacto with useReducer instead of this bunch of states
  const [initialData, setInitialData] = useState<IListContent | null>(null)
  const [invitedEmailState, setInvitedEmailState] = useState<string>('')
  const [removeEmailAnimationIndex, setRemoveEmailAnimationIndex] = useState<
    number | null
  >(null)
  const [invitedEmailsArray, setInvitedEmailsArray] = useState<string[]>([])
  const [beneficiaryEmailsArray, setBeneficiaryEmailsArray] = useState<
    string[]
  >([])

  const [listDetails, setListDetails] = useState({
    name: '',
    thematic: '',
    description: '',
    confidentiality: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)
  const { checkToken } = useCheckAccessTokenHealth()
  const url =
    props.mode === 'create'
      ? '/api/lists/createList'
      : '/api/lists/updateListSettings'

  useEffect(() => {
    const isThereAnyError = Object.values(errors).some((value) => value !== '')

    setIsButtonDisabled(isThereAnyError)
  }, [errors])

  useEffect(() => {
    if (props.initialData) {
      setInitialData(props.initialData)

      const {
        listName,
        thematic,
        description,
        access_level,
      } = props.initialData
      setListDetails({
        name: listName,
        description,
        thematic,
        confidentiality: access_level,
      })

      if (props.initialData.beneficiaries.length > 0) {
        const beneficiaryEmails = props.initialData.beneficiaries.map(
          (beneficiary) => {
            return beneficiary['app-users'].email
          },
        )
        setBeneficiaryEmailsArray(beneficiaryEmails)
      }
      if (props.initialData.invitedEmails.length > 0) {
        const invitedEmails = props.initialData?.invitedEmails.map(
          (invited) => {
            return invited.email
          },
        )
        setInvitedEmailsArray(invitedEmails)
      }
    }
  }, [props.initialData])

  async function sendForm(e: { preventDefault: () => void }) {
    e.preventDefault()
    setIsLoading(true)

    // check if changes occured and then send the data

    if (invitedEmailState) {
      addEmailToList()
        .then((newEmailsArray) => {
          createAndSubmitBody(newEmailsArray)
        })
        .catch(() => {
          setIsLoading(false)
        })
    } else {
      createAndSubmitBody(invitedEmailsArray!)
    }
  }

  const handleEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((previousErrors) => ({ ...previousErrors, email: '' }))
    setIsLoading(false)
    setInvitedEmailState(e.target.value.toLowerCase())
  }, [])

  const addEmailToList = useCallback(
    function addEmailToList() {
      return new Promise<string[]>((resolve, reject) => {
        const sanitizedEmail = sanitize(invitedEmailState.trim())
        const formErrors = validateEmailInput(sanitizedEmail)
        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors)
          return
        }
        if (invitedEmailState) {
          setInvitedEmailsArray((previousEmailsArray) => {
            const newEmailsArray = [...previousEmailsArray, invitedEmailState]
            setInvitedEmailState('')
            resolve(newEmailsArray)
            return newEmailsArray
          })
        } else {
          if (invitedEmailsArray) {
            resolve(invitedEmailsArray)
          }
        }
      })
    },
    [invitedEmailsArray, invitedEmailState],
  )

  const handleEnterKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key.toLowerCase() === 'enter') {
        e.preventDefault()
        addEmailToList()
      }
    },
    [addEmailToList],
  )

  const editSubmit = useCallback(
    async function editSubmit(updatedEmailsArray: string[]) {
      const currentBody: Body = {
        listName: listDetails.name ? listDetails.name.trim() : '',
        invitedEmails: updatedEmailsArray,
        beneficiaryEmails: beneficiaryEmailsArray,
        thematic: listDetails.thematic?.trim()
          ? listDetails.thematic.trim()
          : '',
        accessLevel: listDetails.confidentiality,
        description: listDetails.description?.trim()
          ? listDetails.description.trim()
          : '',
        cyphered: true,
      }

      let id = initialData?.id
      let updatedCoreData: any = {}

      let updatedEmails: any = {}

      if (JSON.stringify(initialData) === JSON.stringify(currentBody)) {
        setErrors({ form: 'Pas de changement, revenez en arrière' })
        setIsLoading(false)
        return
      }

      const changes = {
        listName: listDetails.name !== initialData?.listName,
        thematic: listDetails.thematic !== initialData?.thematic,
        description: listDetails.description !== initialData?.description,
        access_level: listDetails.confidentiality !== initialData?.access_level,
        beneficiaries:
          JSON.stringify(beneficiaryEmailsArray) !==
          JSON.stringify(
            initialData?.beneficiaries.map(
              (beneficiary) => beneficiary['app-users'].email,
            ),
          ),
        invited:
          JSON.stringify(invitedEmailsArray) !==
          JSON.stringify(
            initialData?.invitedEmails.map((invited) => invited.email),
          ),
      }

      if (changes.listName) {
        updatedCoreData = {
          ...updatedCoreData,
          listName: listDetails.name,
        }
      }

      if (changes.description) {
        updatedCoreData = {
          ...updatedCoreData,
          description: listDetails.description,
        }
      }

      if (changes.access_level) {
        updatedCoreData = {
          ...updatedCoreData,
          access_level: listDetails.confidentiality,
        }
      }

      if (changes.thematic) {
        updatedCoreData = {
          ...updatedCoreData,
          thematic: listDetails.thematic,
        }
      }

      if (changes.beneficiaries) {
        const removedBeneficiariesEmails = initialData?.beneficiaries
          .filter(
            (beneficiaries) =>
              !beneficiaryEmailsArray.includes(
                beneficiaries['app-users'].email,
              ),
          )
          .map((beneficiary) => beneficiary['app-users'].email)
        updatedEmails = {
          ...updatedEmails,
          beneficiaryEmails: {
            removedBeneficiariesEmails,
          },
        }
      }

      if (changes.invited) {
        const invitedEmailsAdded = invitedEmailsArray.filter((emailInArray) => {
          const emailNotPresentInitially = !initialData?.invitedEmails.some(
            (invitedElement) => emailInArray === invitedElement.email,
          )
          if (emailNotPresentInitially) {
            return emailInArray
          }
        })
        const removedInvitedEmails = initialData?.invitedEmails
          .filter((invited) => !invitedEmailsArray.includes(invited.email))
          .map((invited) => invited.email)
        updatedEmails = {
          ...updatedEmails,
          invitedEmails: {
            invitedEmailsAdded,
            removedInvitedEmails,
          },
        }
      }

      const emailErrors = validateEditEmails(updatedEmails)
      if (Object.values(emailErrors).length > 0) {
        setErrors(emailErrors)
        setIsLoading(false)
        return
      } else {
        setErrors({})
      }

      const formErrors = validateEditListForm(updatedCoreData)
      if (Object.values(formErrors).length > 0) {
        setErrors(formErrors)
        setIsLoading(false)
        return
      } else {
        setErrors({})
      }

      try {
        const token = await checkToken()
        if (!token) {
          setIsLoading(false)
          router.push('/login')
          return
        }
        const body = { id, updatedCoreData, updatedEmails }
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(body),
        })

        if (response.ok) {
          setIsLoading(false)
          router.push('/')
        }
      } catch (error) {
        setIsLoading(false)
        const errorMessage = getErrorMessage(error)
        setErrors((previousErrors) => ({
          ...previousErrors,
          form: errorMessage,
        }))
      }
    },
    [
      beneficiaryEmailsArray,
      checkToken,
      initialData,
      invitedEmailsArray,
      listDetails.name,
      listDetails.description,
      listDetails.thematic,
      listDetails.confidentiality,
      router,
      url,
    ],
  )

  const createSubmit = useCallback(
    async function createSubmit() {
      const currentBody: Body = {
        listName: listDetails.name?.trim() ? listDetails.name?.trim() : '',
        invitedEmails: invitedEmailsArray,
        beneficiaryEmails: beneficiaryEmailsArray,
        thematic: listDetails.thematic?.trim()
          ? listDetails.thematic.trim()
          : '',
        accessLevel: listDetails.confidentiality,
        description: listDetails.description?.trim()
          ? listDetails.description.trim()
          : '',
        cyphered: true,
      }

      const formErrors = validateCreateListForm(currentBody)
      if (Object.values(formErrors).length > 0) {
        setErrors(formErrors)
        setIsLoading(false)
        return
      } else {
        setErrors({})
      }

      if (currentBody) {
        try {
          const token = await checkToken()
          if (!token) {
            setIsLoading(false)
            router.push('/login')
            return
          }
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(currentBody),
          })

          if (response.ok) {
            setIsLoading(false)
            router.push('/')
          }
        } catch (error) {
          setIsLoading(false)
          const errorMessage = getErrorMessage(error)
          setErrors((previousErrors) => ({
            ...previousErrors,
            form: errorMessage,
          }))
        }
      }
    },
    [
      beneficiaryEmailsArray,
      checkToken,
      invitedEmailsArray,
      listDetails,
      router,
      url,
    ],
  )

  const createAndSubmitBody = useCallback(
    async function createAndSubmitBody(updatedEmailsArray: string[]) {
      if (props.mode === 'create') {
        await createSubmit()
      } else {
        await editSubmit(updatedEmailsArray)
      }
    },
    [createSubmit, props.mode, editSubmit],
  )

  function removeEmailFromList(index: number, type: string) {
    setRemoveEmailAnimationIndex(index)
    setTimeout(() => {
      if (type === 'invited') {
        if (invitedEmailsArray) {
          const newArray = invitedEmailsArray.filter(
            (_, currentIndex) => currentIndex !== index,
          )
          setInvitedEmailsArray(newArray)
          setRemoveEmailAnimationIndex(null)
        }
      } else {
        if (beneficiaryEmailsArray) {
          const newArray = beneficiaryEmailsArray.filter(
            (_, currentIndex) => currentIndex !== index,
          )
          setBeneficiaryEmailsArray(newArray)
          setRemoveEmailAnimationIndex(null)
        }
      }
    }, 400)
  }

  const handleChange = useCallback((field: string, value: string) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }))
    setIsLoading(false)
    setListDetails((prevDetails) => ({ ...prevDetails, [field]: value }))
  }, [])

  const displayEmail = useCallback((email: string): string => {
    if (window.innerWidth < 500 && email.length > 30) {
      return email.slice(0, 6) + '...@' + email.split('@')[1]
    }
    if (window.innerWidth < 340 && email.length > 24) {
      return email.slice(0, 6) + '...@' + email.split('@')[1]
    }
    return email
  }, [])

  const options = [
    {
      value: 'private',
      icon: <EyeSlashIcon />,
      label: 'Privée',
      description: 'Seul(e) vous avez accès à la liste',
    },
    {
      value: 'shared',
      icon: <ShareIcon />,
      label: 'Partagée',
      description:
        'Est accessible aux personnes dont vous renseignez le mail, et qui pourront modifier la liste',
    },
    // Todo  : think about having a public access to a list
    // {
    //   value: 'public',
    //   icon: <GlobeAltIcon />,
    //   label: 'Publique',
    //   description:
    //     'Accessible aux personnes à qui vous envoyez son url, mais ils ne pourront pas la modifier',
    // },
  ]

  const suppressList = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      try {
        const token = await checkToken()
        if (!token) {
          setIsLoading(false)
          router.push('/login')
          return
        }
        const body = { id: props.initialData?.id }
        const response = await fetch('/api/lists/suppressList', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(body),
        })

        if (response.ok) {
          setIsLoading(false)
          router.push('/')
        }
      } catch (error) {
        setIsLoading(false)
        const errorMessage = getErrorMessage(error)
        setErrors((previousErrors) => ({
          ...previousErrors,
          form: errorMessage,
        }))
      }
    },
    [props.initialData?.id, checkToken, router],
  )

  return (
    <form className={classes['root']}>
      <div className={classes['form-element']}>
        <div className={classes['input-section']}>
          <label htmlFor="name" className={classes['label']}>
            {'Nom de la liste'}
          </label>
          <div className={classes['input-container']}>
            <input
              name="name"
              placeholder="(ex: Liste de courses)"
              id="name"
              onChange={(e) => handleChange('name', e.target.value)}
              className={classes['input']}
              value={listDetails.name ? listDetails.name : ''}
            />
            {errors.name && (
              <div className={classes['error']}>{errors.name}</div>
            )}
          </div>
        </div>
        <div className={classes['input-section']}>
          <label htmlFor="thematic" className={classes['label']}>
            Thématique
          </label>
          <div className={classes['input-container']}>
            <input
              name="thematic"
              placeholder="(ex: Maison)"
              id="thematic"
              onChange={(e) => handleChange('thematic', e.target.value)}
              className={classes['input']}
              value={listDetails.thematic ? listDetails.thematic : ''}
            />
            {errors.thematic && (
              <div className={classes['error']}>{errors.thematic}</div>
            )}
          </div>
        </div>
        <div className={classes['input-section']}>
          <label htmlFor="description" className={classes['label']}>
            Description
          </label>
          <div className={classes['input-container']}>
            <input
              name="description"
              placeholder="(ex: Fini le PQ qu'on oublie parce que la liste de courses est restée sur la table!)"
              id="description"
              onChange={(e) => handleChange('description', e.target.value)}
              className={classes['input']}
              value={listDetails.description ? listDetails.description : ''}
            />
            {errors.description && (
              <div className={classes['error']}>{errors.description}</div>
            )}
          </div>
        </div>
      </div>
      <div className={classes['form-element']}>
        <div className={classes['input-section']}>
          <label htmlFor="share" className={classes['label']}>
            Elle est...
          </label>
          <CustomSelector
            initialValue={listDetails.confidentiality}
            options={options}
            onSelectionChange={(value) =>
              handleChange('confidentiality', value)
            }
          />
          {errors.access_level && (
            <div className={classes['error']}>{errors.access_level}</div>
          )}
        </div>
      </div>
      {listDetails.confidentiality === 'shared' && (
        <div
          className={classnames(classes['emails-section'], {
            [classes['email-section-visible']]:
              listDetails.confidentiality === 'shared',
          })}
        >
          <div className={classes['form-element']}>
            <div className={classes['input-section']}>
              <label htmlFor="email" className={classes['label']}>
                Avec qui la partager ?
              </label>
              <div
                className={classNames(
                  classes['input-container'],
                  classes['input-container-row'],
                )}
              >
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="ex: jordan@rangeTaChambre.fr"
                  onChange={handleEmail}
                  onKeyDown={handleEnterKeyDown}
                  value={invitedEmailState}
                  className={classes['input']}
                />
                <UserPlusIcon
                  onClick={() => addEmailToList()}
                  className={classes['plus-icon']}
                />
              </div>
              {errors.email && (
                <div className={classes['error']}>{errors.email}</div>
              )}
            </div>
          </div>

          <div className={classes['emails-container']}>
            <div className={classes['section']}>
              <div className={classes['title-email']}>
                Liste acceptée par...
              </div>
              {beneficiaryEmailsArray?.length === 0 && (
                <div className={classes['nobody']}>
                  <UserIcon className={classes['icon']} />
                  <div className={classes['text']}>Personne pour l'instant</div>
                </div>
              )}
              {beneficiaryEmailsArray?.map((email, index) => (
                <div
                  className={classnames(classes['email-element'], {
                    [classes['email-invisible']]:
                      removeEmailAnimationIndex === index,
                  })}
                  key={index}
                >
                  <div
                    className={classnames(classnames(classes['email-picto']))}
                  >
                    <ChevronRightIcon className={classes['chevron-icon']} />
                  </div>
                  <div className={classes['email-text']}>
                    {displayEmail(email)}
                  </div>
                  <div className={classes['email-picto']}>
                    <UserMinusIcon
                      className={classes['minus-icon']}
                      onClick={() => removeEmailFromList(index, 'beneficiary')}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={classes['section']}>
              {invitedEmailsArray?.length !== 0 && (
                <div className={classes['title-email']}>
                  En attente de réponse
                </div>
              )}
              {invitedEmailsArray.length > 0 &&
                invitedEmailsArray.map((email, index) => (
                  <div
                    className={classnames(classes['email-element'], {
                      [classes['email-invisible']]:
                        removeEmailAnimationIndex === index,
                    })}
                    key={index}
                  >
                    <div
                      className={classnames(classnames(classes['email-picto']))}
                    >
                      <ChevronRightIcon className={classes['chevron-icon']} />
                    </div>
                    <div className={classes['email-text']}>
                      {displayEmail(email)}
                    </div>
                    <div className={classes['email-picto']}>
                      <UserMinusIcon
                        className={classes['minus-icon']}
                        onClick={() => removeEmailFromList(index, 'invited')}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      <div className={classes['button-container']}>
        <Button
          text={props.mode === 'create' ? 'Créer' : 'Editer'}
          onClick={sendForm}
          className={classes['submit-button']}
          isLoading={isLoading}
          disabled={isButtonDisabled}
        ></Button>
        {props.mode === 'edit' && (
          <Button
            text={'Supprimer cette liste'}
            className={classes['erase-button']}
            leftIcon={<ExclamationTriangleIcon />}
            onClick={suppressList}
          ></Button>
        )}
        {errors && <div className={classes['error']}>{errors.form}</div>}
      </div>
    </form>
  )
}
