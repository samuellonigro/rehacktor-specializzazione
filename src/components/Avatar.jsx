import { useEffect, useState } from "react";
import supabase from "../supabase/supabase-client"; // <- percorso corretto


export default function Avatar({ url, size = 100, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) throw error
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Seleziona un’immagine da caricare.')
      }
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)
      if (uploadError) throw uploadError
      onUpload(fileName)
      downloadImage(fileName)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-full shadow-lg"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="rounded-full bg-gray-700 flex items-center justify-center"
          style={{ height: size, width: size }}
        >
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </div>
  )
}
