import React from 'react'
import { useTuning } from '../context/TuningContext'

const LocaleSelect = () => {
    const { locale, setLocale } = useTuning()

    const handleChange = (e) => {
        setLocale(e.target.value)
    }
  return (
    <>
        <select value={locale} onChange={handleChange} id="locale" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block grow p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="en">🇺🇸🇬🇧</option>
            <option value="fr">🇫🇷</option>
            <option value="zh">🇨🇳</option>
            <option value="ro">🇷🇴</option>
            <option value="it">🇮🇹</option>
            <option value="es">🇪🇸</option>
            <option value="ja">🇯🇵</option>
            <option value="hi">🇮🇳</option>
            <option value="ar">🇸🇦</option>
            <option value="he">🇮🇱</option>
        </select>
    </>
  )
}

export default LocaleSelect