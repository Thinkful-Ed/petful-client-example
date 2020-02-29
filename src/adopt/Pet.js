import React from 'react'

export default function({ data }) {
  return <div className='pet'>
    <img src={ data.image } alt='Pet.' />
    <h2>{ data.name }</h2>
    <p>{ data.description }</p>

    <table>
      <tbody>
        <tr>
          <td>Age</td>
          <td>{ data.age }</td>
        </tr>

        <tr>
          <td>Breed</td>
          <td>{ data.breed }</td>
        </tr>

        <tr>
          <td>Gender</td>
          <td>{ data.gender }</td>
        </tr>

        <tr>
          <td>Story</td>
          <td>{ data.story }</td>
        </tr>
      </tbody>
    </table>
  </div>
}