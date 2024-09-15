'use client'
import React, { useState } from 'react'
import {
  ExclamationCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid'
import classnames from 'classnames'
import Link from 'next/link'
import classes from './classes.module.scss'

export default function FAQ() {
  const [isNotReceivedOpened, setIsNotReceivedOpened] = useState<boolean>(false)

  function openNotReceivedContainer() {
    setIsNotReceivedOpened(!isNotReceivedOpened)
  }
  return (
    <div className={classes['root']}>
      <div
        className={classes['email-not-received-container']}
        onClick={openNotReceivedContainer}
      >
        <div className={classes['header']}>
          <div className={classes['title']} onClick={openNotReceivedContainer}>
            <div className={classes['icon-container']}>
              <ExclamationCircleIcon className={classes['icon']} />
            </div>
            <div className={classes['text']}>Je n'ai pas reçu de code</div>
          </div>
          <div className={classes['icon-container']}>
            <ChevronDownIcon
              className={classnames(classes['icon'], {
                [classes['turnUp']!]: !isNotReceivedOpened,
              })}
            />
          </div>
        </div>
        <div
          className={classnames(classes['content-not-received'], {
            [classes['content-visible']]: isNotReceivedOpened,
          })}
        >
          <div className={classes['text']}>
            Veuillez vérifier que votre email est correctement orthographié, et
            que le mail n'est pas dans vos spams.
          </div>
          <div className={classes['text']}>
            Si au bout de 30 minutes vous ne voyez toujours rien ni dans vos
            mails, ni dans vos spams, vous pouvez solliciter nouveau un code via
            ce
            <Link href={'/register'}>
              <span className={classes['redirection-button']}>lien</span>
            </Link>
            .
          </div>
          <div className={classes['text']}>
            Si malgré vos tentatives, vous n'avez toujours pas reçu de code,
            vous pouvez envoyer un mail à l'adresse
            <Link href={'mailto:isisetthea@gmail.com'}>
              <span className={classes['redirection-button']}>suivante</span>
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
