import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMovieStore = defineStore('movie', () => {
    // 从 localStorage 初始化数据（如果需要持久化）
    const savedIds = localStorage.getItem('movie_collected')
    const initialIds = savedIds ? JSON.parse(savedIds) : []
    const movie_collected = ref(initialIds)

    // 添加电影ID
    function addMovieId(movie_id) {
        console.log('添加电影ID前:', movie_collected.value)
        if (!movie_collected.value.includes(movie_id)) {
            movie_collected.value.push(movie_id)
            // 可选：保存到 localStorage 以实现持久化
            localStorage.setItem('movie_collected', JSON.stringify(movie_collected.value))
            console.log('添加电影ID后:', movie_collected.value)
        }
    }

    // 设置多个电影ID
    function setMovieIds(ids) {
        console.log('设置电影IDs:', ids)
        movie_collected.value = ids
        localStorage.setItem('movie_collected', JSON.stringify(movie_collected.value))
    }

    //移除电影
    function removeMovieId(movie_id) {
        console.log('取消电影ID前:', movie_collected.value)
        const index = movie_collected.value.indexOf(movie_id)
        if (index > -1) {
            movie_collected.value.splice(index, 1)
            console.log('取消电影ID前:', movie_collected.value)
        }
    }

    return {movie_collected, addMovieId, setMovieIds, removeMovieId}
})
