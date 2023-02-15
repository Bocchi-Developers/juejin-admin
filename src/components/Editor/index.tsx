import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import 'vditor/dist/index.css'

import Vditor from 'vditor'

interface EditorProps {
  value?: string
}

export interface VdRefObject {
  vd?: Vditor | undefined
}

export const Editor = forwardRef<VdRefObject, EditorProps>((props, ref) => {
  const [vd, setVd] = useState<Vditor>()
  const $wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if ($wrapper.current) {
      const vd = new Vditor($wrapper.current, {
        height: '78vh',
        preview: {
          hljs: {
            lineNumber: true,
          },
        },
        theme: 'classic',
        cache: {
          enable: false,
        },

        after: () => {
          vd.setValue(props.value || '')
        },
      })
      setVd(vd)
    }
  }, [])
  useImperativeHandle(ref, () => ({
    vd,
  }))

  return <div ref={$wrapper} />
})
