import React, { useEffect, useState, memo } from 'react'
import { List, Item } from './styles'
import { Category } from '../Category'

function useCategoriesData () {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const getCategories = async () => {
      let response = await window.fetch('https://blue-bird-server.aydeeqm.now.sh/categories')
      response = await response.json()
      setCategories(response)
      setLoading(false)
    }
    getCategories()
  }, [])

  return { categories, loading }
}

const ListOfCategoriesComponent = () => {
  const { categories, loading } = useCategoriesData()
  const [showFixed, setShowFixed] = useState(false)

  useEffect(() => {
    const onScroll = e => {
      const newShowFixed = window.scrollY > 200
      showFixed !== newShowFixed && setShowFixed(newShowFixed)
    }

    document.addEventListener('scroll', onScroll)

    // clean effect
    return () => document.removeEventListener('scroll', onScroll)
  }, [showFixed])

  const renderList = (fixed) => (
    <List fixed={fixed}>
      {
        loading
          ? <Item key='loading'><Category /></Item>
          : categories.map(
            category => <Item key={category.id}><Category {...category} path={`/pet/${category.id}`} /></Item>
          )
      }
    </List>
  )

  return (
    <>
      {renderList()}
      {showFixed && renderList(true)}
    </>
  )
}

export const ListOfCategories = memo(ListOfCategoriesComponent)
