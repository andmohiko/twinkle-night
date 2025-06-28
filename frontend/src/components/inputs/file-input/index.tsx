'use client'

/* eslint-disable @next/next/no-img-element */
import { LoadingOverlay, Image, CloseButton, Overlay } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { notifications } from '@mantine/notifications'
import { AiOutlineUpload } from 'react-icons/ai'
import { BiErrorCircle } from 'react-icons/bi'
import { MdOutlineAddPhotoAlternate } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'

import ReactCrop from 'react-image-crop'

import styles from './style.module.css'
import { useCropImageInput, type FileObject } from './useCropImageInput'

import { FlexBox } from '@/components/base/flex-box'
import { ActionModal } from '@/components/modals/action-modal'

type Props = {
  value: FileObject
  onChange: (file: FileObject | undefined) => void
  error?: string | undefined
}

export const FileInputWithCropper = ({
  value,
  onChange,
  error,
}: Props): React.ReactElement => {
  const [
    { file, uncroppedImageUrl, selectedImageRef, crop },
    { onSelectImage, remove, onCrop, onChangeCrop, closeCropper },
    { isOpenCropper, isDisabled, isLoading },
  ] = useCropImageInput(value, onChange)

  return (
    <div>
      {file ? (
        <ImagePreview file={file} onRemove={remove} />
      ) : (
        <>
          <Dropzone
            onDrop={onSelectImage}
            onReject={() => {
              notifications.show({
                title: 'ファイルのアップロードに失敗しました',
                message: '',
                icon: <BiErrorCircle />,
                withCloseButton: true,
                autoClose: 8000,
                color: 'red',
              })
            }}
            maxSize={100 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            className={styles.dropzone}
            disabled={isDisabled || isLoading}
          >
            <FlexBox gap={16} justify="center">
              <Dropzone.Accept>
                <AiOutlineUpload color="#FFFFFF" size={50} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <RxCross1 color="#FFFFFF" size={50} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <div className={styles.dropzoneIdle}>
                  <MdOutlineAddPhotoAlternate color="#FFFFFF" size={50} />
                </div>
              </Dropzone.Idle>
              {isLoading && <LoadingOverlay visible />}
            </FlexBox>
            {isDisabled && <Overlay color="#fff" opacity={0.7} />}
          </Dropzone>
          {error && <span className={styles.error}>{error}</span>}

          {uncroppedImageUrl && (
            <ActionModal
              isOpen={isOpenCropper}
              onClose={closeCropper}
              onSave={onCrop}
              title="画像を編集"
            >
              <ReactCrop
                crop={crop}
                onChange={(c) => onChangeCrop(c)}
                keepSelection={true}
              >
                <img
                  src={uncroppedImageUrl}
                  ref={selectedImageRef}
                  alt=""
                  style={{
                    height: '100%',
                    width: '100%',
                    maxHeight: 400,
                  }}
                />
              </ReactCrop>
            </ActionModal>
          )}
        </>
      )}
    </div>
  )
}

type ImagePreviewProps = {
  file: FileObject
  onRemove: () => void
}

export const ImagePreview = ({
  file,
  onRemove,
}: ImagePreviewProps): React.ReactElement => (
  <div className={styles.imagePreview}>
    <Image src={file} alt="" className={styles.image} />
    <CloseButton
      size="sm"
      variant="light"
      pos="absolute"
      top={-4}
      right={-4}
      color="gray"
      onClick={onRemove}
    />
  </div>
)
