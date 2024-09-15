import React, { useState, useEffect } from 'react'
import classes from './classes.module.scss'
import classnames from 'classnames'
import {
  InformationCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

type IProps = {
  options: {
    value: string
    icon: JSX.Element
    label: string
    description: string
  }[]
  onSelectionChange: (value: string) => void
  initialValue?: string
}

type HoveredState = {
  [key: string]: boolean
}

const CustomSelector = React.memo(function CustomSelector(props: IProps) {
  const [selected, setSelected] = useState<string | null>()
  const [hovered, setHovered] = useState<HoveredState>({})

  useEffect(() => {
    setSelected(props.initialValue)
  }, [props.initialValue])

  function handleOptionClick(value: string) {
    setSelected(value)
    props.onSelectionChange(value)
  }
  return (
    <div className={classes['root']}>
      <div className={classes['options-container']}>
        {props.options.map((option, index) => (
          <div
            className={classes['option']}
            key={index}
            onClick={() => handleOptionClick(option.value)}
          >
            <div
              className={classnames(classes['flip-card-container'], {
                [classes['flip-card-hovered']]: hovered[option.value],
              })}
            >
              <div
                className={classnames(classes['card-front'], {
                  [classes['selected']]: selected === option.value,
                })}
              >
                <div className={classes['option-svg']}>{option.icon}</div>
                <div className={classes['option-label']}>{option.label}</div>
                <div className={classes['info-svg']}>
                  <InformationCircleIcon
                    onMouseEnter={() =>
                      setHovered({ ...hovered, [option.value]: true })
                    }
                    onMouseLeave={() =>
                      setHovered({ ...hovered, [option.value]: false })
                    }
                  />
                </div>
              </div>
              <div
                className={classnames(classes['card-back'], {
                  [classes['selected']]: selected === option.value,
                })}
              >
                <div className={classes['back-svg-icon']}>
                  <ArrowLeftIcon
                    onClick={() =>
                      setHovered({ ...hovered, [option.value]: false })
                    }
                  />
                </div>
                <div className={classes['option-description']}>
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default CustomSelector
