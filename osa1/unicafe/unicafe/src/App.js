import { useState } from 'react'

const FeedbackLine = (props) => {
  return (
    <tbody>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
    </tbody>
  )
}

const Statistics = (props) => {
  console.log(props)
  let average = (props.good - props.bad) / (props.good + props.bad + props.neutral)
  let pos = 100 * ( props.good/ (props.good + props.bad + props.neutral))
  return (
    <table>
      <FeedbackLine text='good' value={props.good}/>
      <FeedbackLine text='neutral' value={props.neutral}/>
      <FeedbackLine text='bad' value={props.bad}/>
      <FeedbackLine text='average' value={average}/>
      <FeedbackLine text='positive' value={pos + '%'}/>
    </table>
  )
}

const Feedback = (props) => {
  if ((props.good + props.bad + props.neutral) == 0) {
    return (
      <h1>
        No feedback
      </h1>
    )
  }
  else {
    return (
      <Statistics good = {props.good} neutral= {props.neutral} bad= {props.bad} />
    )
  }
}

const FeedbackButton = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.valueName}
    </button>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <FeedbackButton valueName = 'good' handleClick = {() => setGood(good +1)}/>
      <FeedbackButton valueName = 'neutral' handleClick = {() => setNeutral(neutral +1)}/>
      <FeedbackButton valueName = 'bad' handleClick = {() => setBad(bad +1)}/>
      
      <Feedback good = {good} neutral= {neutral} bad= {bad} />
    </div>
  )
}

export default App