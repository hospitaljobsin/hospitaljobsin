package com.hospitaljobsin.hospitaljobsin

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform