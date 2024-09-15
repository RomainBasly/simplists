import React from 'react'
import classes from './classes.module.scss'
import { Cog8ToothIcon } from '@heroicons/react/24/solid'
import { IBeneficiary, IList, IUser } from '../ListPage'
import { useRouter } from 'next/navigation'

type IProps = {
  id: string
  listName: string
  thematic: string
  description: string
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

  function formatBeneficiaries(beneficiaryList: IBeneficiary[]) {
    if (props.beneficiaries) {
      switch (beneficiaryList.length) {
        case 0:
          return 'Liste privée ou non acceptée par les autres bénéficiaires'
        case 1:
          return `Partagée avec ${props.beneficiaries[0]['app-users'].userName}`
        case 2:
          return `Partagée avec ${props.beneficiaries[0]['app-users'].userName} et ${props.beneficiaries[1]['app-users'].userName}`
        case 3:
          return `Partagée avec ${props.beneficiaries[0]['app-users'].userName}, ${props.beneficiaries[1]['app-users'].userName}
      et ${props.beneficiaries[2]['app-users'].userName}`
        case 4:
          return `Partagée avec ${props.beneficiaries[0]['app-users'].userName}, ${props.beneficiaries[1]['app-users'].userName}
      et ${props.beneficiaries[2]['app-users'].userName} et une autre personne`
        default:
          return `Partagée avec ${
            props.beneficiaries[0]['app-users'].userName
          }, ${props.beneficiaries[1]['app-users'].userName} et ${
            props.beneficiaries[2]['app-users'].userName
          } et ${props.beneficiaries.length - 2} autres personnes`
      }
    }
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
      <div className={classes['shared-with']}>
        {props.beneficiaries && formatBeneficiaries(props.beneficiaries)}
      </div>
    </div>
  )
}
