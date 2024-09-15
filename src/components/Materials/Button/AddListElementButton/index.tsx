import React, { useState } from 'react'
import classes from './classes.module.scss'
import { PlusIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import EditListForm from '@/components/Elements/Forms/EditListForm'

type IProps = {
  onInputSubmit: (value: string) => Promise<boolean | null>
}

export default function DynamicButtonInput(props: Readonly<IProps>) {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const changeButtonToInput = () => setIsEditing(true)

  return (
    <div className={classes['root']} onClick={changeButtonToInput}>
      <button
        className={classNames(classes['dynamic-button'], {
          [classes['is-button-invisible']]: isEditing,
        })}
      >
        <div className={classes['svg']}>
          <PlusIcon />
        </div>
        <div className={classes['text']}>Ajouter un élément</div>
      </button>
      <EditListForm
        onInputSubmit={props.onInputSubmit}
        isEditing={isEditing}
        handleEditing={() => setIsEditing(!isEditing)}
        type={'add-element'}
      />
    </div>
  )
}
