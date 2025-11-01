"use client"

import { useState } from "react"
import "../styles/AnimatedInput.css"

function AnimatedInput({
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => {},
  onBlur = () => {},
  error = false,
  name = "",
}) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const isActive = isFocused || hasValue

  return (
    <div className="animated-input-wrapper">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false)
          onBlur(e)
        }}
        className={`animated-input ${error ? "error" : ""}`}
        placeholder=" "
      />
      <label className={`animated-label ${isActive ? "active" : ""}`}>{placeholder}</label>
    </div>
  )
}

export default AnimatedInput
