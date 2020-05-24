import clsx from 'clsx'
import React, { ButtonHTMLAttributes, Ref, forwardRef } from 'react'

import { InfimaButtonProps } from '@/types'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & InfimaButtonProps

function Button(
  {
    active = false,
    block = false,
    children,
    className,
    color,
    disabled,
    outline = false,
    size,
    ...props
  }: Props,
  ref?: Ref<HTMLButtonElement>
): JSX.Element {
  return (
    <button
      className={clsx(
        'button',
        {
          'button--active': active,
          'button--block': block,
          'button--disabled': disabled,
          'button--outline': outline,
          [`button--${color}`]: !!color,
          [`button--${size}`]: !!size
        },
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
}

export default forwardRef(Button)
