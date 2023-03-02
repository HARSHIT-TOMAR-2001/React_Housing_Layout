import React, { useState } from 'react'
import './App.css'
import {getRandomNumber} from './utils/helper'

function App() {
  const [layout, setLayout] = useState([])
  const [bestHouseIndex, setBestHouseIndex] = useState({ row: -1, col: -1 })

  const handleCreateLayout = (event) => {
    event.preventDefault()
    const rows = parseInt(event.target.rows.value)
    const cols = parseInt(event.target.cols.value)
    const newLayout = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 'empty'),
    )
    setLayout(newLayout)
    setBestHouseIndex({ row: -1, col: -1 })
  }

  const handleAssignPlot = (rowIndex, colIndex, value) => {
    const newLayout = [...layout]
    newLayout[rowIndex][colIndex] = value
    setLayout(newLayout)
  }

  const handleRecommendHouse = () => {
    let house = []
    let gym = []
    let hospital = []
    let restaurant = []
    let houseMap = new Map()
    for (let i = 0; i < layout.length; i++) {
      for (let j = 0; j < layout[i].length; j++) {
        let plotValue = layout[i][j]?.toLowerCase()
        console.log(plotValue)
        if (plotValue === 'house') {
          house.push({ row: i, col: j })
        } else if (plotValue === 'gym') {
          gym.push({ row: i, col: j })
        } else if (plotValue === 'hospital') {
          hospital.push({ row: i, col: j })
        } else if (plotValue === 'restaurant') {
          restaurant.push({ row: i, col: j })
        } else if (plotValue === 'restaurant-gym') {
          restaurant.push({ row: i, col: j })
          gym.push({ row: i, col: j })
        } else if (plotValue === 'restaurant-hospital') {
          restaurant.push({ row: i, col: j })
          hospital.push({ row: i, col: j })
        } else if (plotValue === 'gym-hospital') {
          restaurant.push({ row: i, col: j })
          gym.push({ row: i, col: j })
        }
      }
    }

    let bestHouse = { row: -1, col: -1 }
    let bestHouseScore = Number.MAX_VALUE

    for (let i = 0; i < house.length; i++) {
      let minGymScore = Number.MAX_VALUE
      let minResScore = Number.MAX_VALUE
      let minHospScore = Number.MAX_VALUE
      if (gym.length === 0) minGymScore = 0
      if (restaurant.length === 0) minResScore = 0
      if (hospital.length === 0) minHospScore = 0

      let hr = house[i].row
      let hc = house[i].col

      for (let g = 0; g < gym.length; g++) {
        let gr = gym[g].row
        let gc = gym[g].col
        console.log(gr, gc)

        let gymScore = Math.abs(gr - hr) + Math.abs(hc - gc)
        console.log(gr, gc, gymScore)
        minGymScore = Math.min(minGymScore, gymScore)
      }
      for (let g = 0; g < hospital.length; g++) {
        let gr = hospital[g].row
        let gc = hospital[g].col
        console.log(gr, gc)

        let hosScore = Math.abs(gr - hr) + Math.abs(hc - gc)
        console.log(gr, gc, hosScore)
        minHospScore = Math.min(minHospScore, hosScore)
      }
      for (let g = 0; g < restaurant.length; g++) {
        let gr = restaurant[g].row
        let gc = restaurant[g].col

        let resScore = Math.abs(gr - hr) + Math.abs(hc - gc)
        console.log(gr, gc, resScore)
        minResScore = Math.min(minResScore, resScore)
      }
      let sum = minGymScore + minHospScore + minResScore
      console.log('baby', sum, bestHouseScore)
      if (sum < bestHouseScore) {
        console.log('hello', sum)
        bestHouse = { row: hr, col: hc }
        bestHouseScore = sum
      }

      houseMap.set({ row: hr, col: hc }, sum)
    }
    console.log(bestHouse)
    setBestHouseIndex(bestHouse)
  }

  return (
    <div className='pageContainer'>
      <div className='topContainer'>
        <h2 className='topHeading'>Create Housing Layout</h2>
        <div className='topFormContainer'>
          <form className='topForm' onSubmit={handleCreateLayout}>
            <label className='topRowLabel' htmlFor='rows'>
              Rows:
            </label>
            <input className='topRowInput' type='number' id='rows' name='rows' required min='1' />
            <label className='topColumnLabel' htmlFor='cols'>
              Columns:
            </label>
            <input
              className='topColumnInput'
              type='number'
              id='cols'
              name='cols'
              required
              min='1'
            />
            <button className='topCreateLayoutButton' type='submit'>
              Create Layout
            </button>
          </form>
        </div>
      </div>
      {layout.length > 0 && (
        <div className='layoutContainer'>
          <h2 className='layoutContainerHeading'>Assign Plots</h2>
          <div className='layoutTableContainer'>
            <table>
              <tbody>
                {layout.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((col, colIndex) => (
                      <td key={colIndex}>
                        <select
                          style={{
                            backgroundColor:
                              rowIndex === bestHouseIndex.row && colIndex === bestHouseIndex.col
                                ? 'greenyellow'
                                : '',
                          }}
                          value={col}
                          onChange={(event) =>
                            handleAssignPlot(rowIndex, colIndex, event.target.value)
                          }
                        >
                          <option value='empty'>Empty</option>
                          <option value='restaurant'>Restaurant</option>
                          <option value='gym'>Gym</option>
                          <option value='hospital'>Hospital</option>
                          <option value='restaurant-gym'>Restaurangt-Gym</option>
                          <option value='restaurant-hospital'>Restaurangt-Hospital</option>
                          <option value='gym-hospital'>Gym-Hospital</option>
                          <option value='house'>House `${getRandomNumber(2)}`</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='layoutBottomContainer'>
            <button className='bestHouseIdentifyButton' onClick={handleRecommendHouse}>
              Identify Best House
            </button>
            <div className='layoutBottomResults'>
              <p className='layoutBottomRowResults'>
                Best House Row Position: {bestHouseIndex.row + 1}
              </p>
              <p className='layoutBottomColResults'>
                Best House Column Position: {bestHouseIndex.col + 1}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default App
