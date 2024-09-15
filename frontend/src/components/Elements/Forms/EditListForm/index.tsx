import React, { forwardRef, useState } from 'react'
import classNames from 'classnames'
import classes from './classes.module.scss'
import { sanitize } from 'isomorphic-dompurify'
import { validateInputAddItemToList } from '@/Services/validation'
import { getErrorMessage } from '@/Services/errorHandlingService'
import { PlusIcon } from '@heroicons/react/24/solid'

type IProps = {
  id?: string
  type: string
  isEditing?: boolean | null
  content?: string
  handleEditing?: () => void
  onInputSubmit: (
    updatedContent: string,
    elementId?: string,
    onSuccess?: () => void,
  ) => Promise<boolean | null>
  onInputChange?: (newInput: string) => void
}

const EditListForm = forwardRef<HTMLInputElement, IProps>((props, ref) => {
  const [errors, setErrors] = useState<Record<string, string>>()
  const [value, setValue] = useState<string | undefined>(props.content)

  const submitForm = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!value) {
      setErrors({ ...errors, itemContent: 'Le champ ne peut pas être vide' })
      return
    }
    const sanitizedElement = sanitize(value)
    const formErrors = validateInputAddItemToList(sanitizedElement.trim())
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    try {
      if (props.id) {
        const success = await props.onInputSubmit(sanitizedElement, props.id)
        if (success) {
          if (props.handleEditing) {
            props.handleEditing()
          }
          setValue('')
        }
      } else {
        const success = await props.onInputSubmit(sanitizedElement.trim())
        if (success) {
          setValue('')
        }
      }
    } catch (error) {
      // Todo : add error for that problem
      const errorMessage = getErrorMessage(error)
      setErrors({ ...errors, form: errorMessage })
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // voir si setValue a une utilté
    setValue(event?.target.value)
    if (props.onInputChange) {
      props.onInputChange(event?.target.value)
    }
    setErrors({ ...errors, itemContent: '' })
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      await submitForm(e)
    }
  }
  return (
    <form
      className={classNames({
        [classes['add-element']]: props.type === 'add-element',
        [classes['is-form-visible']]: props.isEditing,
        [classes['edit-element']]: props.type === 'edit-element',
      })}
      onSubmit={submitForm}
    >
      <div className={classes['content']}>
        <input
          className={classNames(classes['dynamic-input'], {
            [classes['error-form']]: errors?.itemContent,
          })}
          placeholder={props.content || '(ex: Ranger ses Power Rangers)'}
          onChange={handleInputChange}
          autoFocus
          type={'text'}
          onKeyDown={handleKeyDown}
          value={value}
          ref={ref}
        />
        <div
          className={classes['svg']}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            submitForm(e)
          }}
        >
          <PlusIcon />
        </div>
      </div>
      <div className={classes['error-container']}>
        {errors && errors.itemContent && (
          <div className={classes['error']}>{errors.itemContent}</div>
        )}
      </div>
    </form>
  )
})

EditListForm.displayName = 'EditListForm'

export default EditListForm
