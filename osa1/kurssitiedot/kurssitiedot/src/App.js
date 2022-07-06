const Header =(props) => {
  return (
    <div>
      <h1>
        {props.course}
      </h1>
    </div>
  )
}

const Part = (props) => {
  return (
  <div>
    <p>
      { props.name } { props.exercises }
    </p>
  </div>
  )
}

const Content = (props) => {
  console.log(props.parts)
  let yeaa = []
  props.parts.forEach(element => {
    yeaa.push(
      (<p>{element.name} {element.exercises}</p>)
    )
  });
  console.log(yeaa)
  return (
  <div>
    {yeaa}
  </div>
  )
}

const Total = (props) => {
  let sum = 0
  props.parts.forEach(element => {
    sum += element.exercises
  });
  return (
  <div>
    <p>
      Number of exercises {sum}
    </p>
  </div>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
