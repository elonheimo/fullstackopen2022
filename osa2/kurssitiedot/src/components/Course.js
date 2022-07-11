const Header =(props) => {
    return (
      <div>
        <h1>
          {props.course}
        </h1>
      </div>
    )
  }
  
  const Content = (props) => {
    const {parts} = props;
    console.log('parts', props.parts, parts)
    return (
    <div>
      {parts.map(part =>
        <p key = {part.id}>
        {part.name} {part.exercises}
        </p>
      )}
    </div>
    )
  }
  
  const Total = (props) => {
    const {parts} = props;
    const amm = parts.reduce((total, part) => total + part.exercises, 0)
    console.log(amm)
    return (
      <p><b>
        Total of {amm} exercises
      </b></p>
    )
  }
  
  const Course = ({courses}) => {
    console.log('courses', courses)
    return (
      <div> 
        {courses.map(course =>
          <div key={course.id}>
            <Header course={course.name} key={course.id} />
            <Content parts={course.parts}/>
            <Total parts={course.parts}/>
          </div>
        )}
      </div>
      )
  }

export default Course