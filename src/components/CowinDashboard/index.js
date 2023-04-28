// Write your code here
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    lastVaccination: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    //  console.log(response)

    if (response.ok === true) {
      const data = await response.json()
      //  console.log(data.last_7_days_vaccination)

      const last7DaysVaccination = data.last_7_days_vaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      //  console.log(last7DaysVaccination)

      const vaccinationByAge = data.vaccination_by_age
      //   console.log(vaccinationByAge)

      const vaccinationByGender = data.vaccination_by_gender

      // console.log(vaccinationByGender)

      this.setState({
        lastVaccination: last7DaysVaccination,
        vaccinationByAge,
        vaccinationByGender,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVaccinationStats = () => {
    const {lastVaccination, vaccinationByAge, vaccinationByGender} = this.state

    return (
      <>
        <VaccinationCoverage details={lastVaccination} />
        <VaccinationByAge ageDetails={vaccinationByAge} />
        <VaccinationByGender genderDetails={vaccinationByGender} />
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loading-view" data-testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderViewsBasedOnAPIStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVaccinationStats()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="card-container">
          <div className="heading-container">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="website-heading">Co-Win</h1>
          </div>
          <h1 className="main-heading">Cowin vaccination in India</h1>

          {this.renderViewsBasedOnAPIStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
