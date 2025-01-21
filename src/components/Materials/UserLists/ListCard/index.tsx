import React from 'react'
import classes from './classes.module.scss'
import { Cog8ToothIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { IBeneficiary } from '../../../../../types/types'

type IProps = {
  id: string
  listName: string
  thematic?: string
  beneficiaries?: IBeneficiary[]
}

export default function ListCard(props: IProps) {
  const router = useRouter()

  function formatTitle(listName: string): string {
    const firstLetter = listName[0].toUpperCase()
    let restOfLetters: string = ''
    for (let i = 1; i < listName.length; i++) {
      restOfLetters += listName[i].toLowerCase()
    }

    return firstLetter + restOfLetters
  }


  const handleListSettingsClick = (event: React.MouseEvent, listId: string) => {
    event.stopPropagation()
    const url = `/lists/edit-list/${listId}`
    router.push(url)
  }

  return (
    <div className={classes['root']}>
      <div className={classes['header']}>
        <div className={classes['thematic']}>{props.thematic}</div>
        <div className={classes['icon']}>
          <Cog8ToothIcon
            onClick={(e) => handleListSettingsClick(e, props.id)}
          />
        </div>
      </div>
      <div className={classes['title']}>{formatTitle(props.listName)}</div>
      {/* <div className={classes['shared-with']}>
        {props.beneficiaries && formatBeneficiaries(props.beneficiaries)}
      </div> */}
    </div>
  )
}
