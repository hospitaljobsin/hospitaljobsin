package com.nvadi.hospitaljobs

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform