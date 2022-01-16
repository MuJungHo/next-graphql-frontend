import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'
import { initializeApollo } from '../apollo/client'
import Todo from '../component/Todo'
import { Button } from '@material-ui/core';
const TodoList = gql`
query Message {
	todos{
    data{
      id
      attributes{
        content
        finish
      }
    }
  }
}
`
const CREATE_TODO = gql`
mutation CreateTodo($title: String!, $content: String!) {
  createTodosuid(data: {title: $title, content: $content, publishedAt: "2019-09-01T15:04:12.627Z"}) {
    data{
      attributes{
        title
        content
      }
    }
  }
}
`;
const Index = () => {
  const {
    data: { todos },
  } = useQuery(TodoList)
  let todoData = todos.data
  todoData = todoData.map(data => ({ id: data.id, ...data.attributes }))
  const [addTodo, { data, loading, error }] = useMutation(CREATE_TODO);
  let input;

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo({ variables: { title: input.value, content: input.value } });
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
      {
        todoData.map((todo, index) => <Todo key={index} todo={todo} />)
      }
    </div>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: TodoList,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Index
