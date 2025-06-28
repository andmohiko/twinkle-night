import { useState, useCallback, useEffect, useRef, RefObject } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { type Crop } from 'react-image-crop'
import { v4 as uuid } from 'uuid'

import { uploadImage } from '@/infrastructure/storage/UploadOperations'

const storagePath = 'images/avatars'

export type FileWithPath = File & {
  path?: string
}

type FileUrl = string
export type FileObject = FileUrl

export const useCropImageInput = (
  file: FileObject | undefined,
  setFile: (file: FileObject | undefined) => void,
): [
  {
    file: FileObject | undefined
    selectedImageRef: RefObject<HTMLImageElement | null>
    uncroppedImageUrl: string | undefined
    crop: Crop
  },
  {
    onSelectImage: (files: Array<File>) => void
    remove: () => void
    onChangeCrop: (crop: Crop) => void
    onCrop: () => void
    closeCropper: () => void
  },
  {
    isOpenCropper: boolean
    isDisabled: boolean
    isLoading: boolean
  },
] => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isDisabled = Boolean(file)
  const [isOpen, handlers] = useDisclosure()
  const [fileData, setFileData] = useState<File | undefined>()
  const imageRef = useRef<HTMLImageElement>(null)
  const [uncroppedImageUrl, setUncroppedImageUrl] = useState<
    string | undefined
  >()
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  })

  // canvasで画像を扱うため、アップロードした画像のuncroppedImageUrlをもとに、imgのHTMLElementを作る
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img: HTMLImageElement = document.createElement('img')
      img.src = src
      img.onload = () => resolve(img)
    })
  }

  // 切り取った画像のObjectUrlを作成し、フォームに保存する
  const createCroppedImageUrl = async () => {
    if (uncroppedImageUrl && imageRef.current) {
      const img = await loadImage(uncroppedImageUrl)
      const scaleX = img.naturalWidth / imageRef.current.width
      const scaleY = img.naturalHeight / imageRef.current.height

      const canvas = document.createElement('canvas')
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.beginPath()
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        0,
        2 * Math.PI,
        false,
      )
      ctx.clip()

      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      )

      canvas.toBlob(async (result) => {
        if (result instanceof Blob) {
          setIsLoading(true)
          const filename = uuid()
          const remoteFileUrl = await uploadImage(
            `${storagePath}/${filename}`,
            result,
          )
          setFile(remoteFileUrl)
          setIsLoading(false)
        }
      })
    }
  }

  const onCrop = () => {
    setIsLoading(true)
    createCroppedImageUrl()
    handlers.close()
    setIsLoading(false)
  }

  useEffect(() => {
    if (fileData instanceof File) {
      if (uncroppedImageUrl) {
        URL.revokeObjectURL(uncroppedImageUrl)
      }
      setUncroppedImageUrl(URL.createObjectURL(fileData))
      handlers.open()
    } else {
      setUncroppedImageUrl(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileData])

  const remove = useCallback(() => {
    setFile('')
  }, [setFile])

  const onSelectImage = useCallback((inputFiles: Array<FileWithPath>): void => {
    if (!inputFiles || inputFiles.length === 0) {
      return
    }
    const file = inputFiles[0]
    setFileData(file)
  }, [])

  return [
    {
      file,
      selectedImageRef: imageRef,
      uncroppedImageUrl,
      crop,
    },
    {
      onSelectImage,
      onChangeCrop: setCrop,
      remove,
      closeCropper: handlers.close,
      onCrop,
    },
    {
      isDisabled,
      isLoading,
      isOpenCropper: isOpen,
    },
  ]
}
