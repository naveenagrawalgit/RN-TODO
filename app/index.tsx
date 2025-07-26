import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


type ToDoType = {
 
  id: number;
  title: string;
  isDone: boolean;

}

export default function Index() {



  const tasks = [
  { id: 1, title: "Design", isDone: false },
  { id: 2, title: "Deploy", isDone: true },
  { id: 3, title: "Refactor", isDone: false },
  { id: 4, title: "Launch", isDone: true },
  { id: 5, title: "Debug", isDone: false },
  { id: 6, title: "Review", isDone: true },
  { id: 7, title: "Test", isDone: false },
  { id: 8, title: "Commit", isDone: true }
];

  const [todos,setTodos] = useState<ToDoType[]>([])
  const [todoText,setTodoText] = useState<string>('')
  const [searchQuery,setSearchQuery] = useState<string>('')
  const [oldTodos,setOldTodos] = useState<ToDoType[]>([])



  useEffect(()=>{

    const getTodos = async ()=>{

   try {
     const todos = await AsyncStorage.getItem('my-todo');
     if(todos !== null){
       setTodos(JSON.parse(todos))
       setOldTodos(JSON.parse(todos))
     }
   } catch (error) {
    console.log(error)
   }

    }
    getTodos()



  },[])

  const addTodo = async ()=> {
    
    if (!todoText.trim()) return;

    try {
      const newTodo = {
          id: Math.random(),
          title: todoText,
          isDone: false,
      }

      const updatedTodos = [...todos,newTodo];


        
        setTodos(updatedTodos);
        setOldTodos(updatedTodos);
        await AsyncStorage.setItem('my-todo',JSON.stringify(updatedTodos));
        setTodoText('');
        Keyboard.dismiss();
    } catch (error) {

      console.log(error)
      
    }



  }


  const deleteTodo = async(id: number)=>{

   try {
     const newTodos = todos.filter((todo)=> todo.id !== id)
     await AsyncStorage.setItem('my-todo',JSON.stringify(newTodos))
     setTodos(newTodos)
          setOldTodos(newTodos)


     
   } catch (error) {
    console.log(error)
   }
  }

  const handleDone = async(id: number)=>{

    try {
      const newTodos = todos.map((todo)=>{

        if(todo.id === id){
          todo.isDone = !todo.isDone;
        }

        return todo
      });

      await AsyncStorage.setItem('my-todo',JSON.stringify(newTodos))
      setTodos(newTodos)
           setOldTodos(newTodos)

    } catch (error) {
      console.log(error)
      
    }

  }

  const onSearch = (query: string) =>{

    if(query == ''){
      setTodos(oldTodos)
    }
    else{
       const filterTodos = todos.filter((todo)=>
      todo.title.toLowerCase().includes(query.toLowerCase())
    )
    setTodos(filterTodos)
    }
  }


  useEffect(()=> {
    onSearch(searchQuery)
  },[searchQuery])

  return ( 
    < SafeAreaView style={styles.container} >
      
      <View  style={styles.header} >

        <TouchableOpacity onPress={()=>(alert("clicked"))} >
        <Ionicons name="menu" size={24} color={'333'} />

        </TouchableOpacity>

        <TouchableOpacity onPress={()=>(alert("profile"))} >
          
        <Ionicons name="person" size={24} style={{width: 20, height: 20, borderRadius: 10, marginRight: 20  }} />
        </TouchableOpacity>

        
      </View>

      <View style={styles.SearchBar} >

        <Ionicons name="search" size={24} color={"#333"}/>

        <TextInput 
        placeholder="Search" 
        style={styles.searchInput}
        clearButtonMode="always" 
        onChangeText={(text)=> setSearchQuery(text)}
        autoCorrect={false}
        value={searchQuery}
        
        />

      

      </View>

      <FlatList data={[...todos].reverse()} keyExtractor={(item)=> item.id.toString()}  
      
      renderItem={({item})=>(

          <ToDoItem item={item}
           deleteTodo={deleteTodo} 
          handleTodo={handleDone} />
       
      )} 
      />

      <KeyboardAvoidingView  behavior="padding" keyboardVerticalOffset={10}  style={styles.footer} >
        <TextInput 
        placeholder="Add New ToDo" 
        style={styles.newTodoInput}
        value={todoText}
        onChangeText={(text) => setTodoText(text)}
        />
        <TouchableOpacity style={styles.addButton}  onPress={()=>addTodo()} >

        <Ionicons name="add" size={24} color={'#fff'}/>

        </TouchableOpacity>

      </KeyboardAvoidingView>



    </SafeAreaView>
  );
}





const ToDoItem = ({item,
  deleteTodo,
  handleTodo,
} : {
  item: ToDoType,
   deleteTodo: (id: number) => void,
   handleTodo: (id: number) => void,
  
  })=> (

   <View style={styles.todoContainer}  >

          <View style={styles.todoInfoContainer} >

          <Checkbox value={item.isDone}
          onValueChange={()=> handleTodo(item.id)}
          
          color={item.isDone? '#4630EB': undefined} />
          <Text style={[
            styles.todoText, 
            item.isDone && {textDecorationLine: "line-through"}]}  
            >{item.title}</Text>

          </View>

          <TouchableOpacity onPress={()=> {deleteTodo(item.id)}} >
              <Ionicons name="trash" size={24} color={'red'} />
          </TouchableOpacity>

        </View>
)




const styles = StyleSheet.create({
 container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5'
      },

      header:{
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        marginBottom: 20,
      
      },

      SearchBar: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: 20,
        padding: 5,
        borderRadius: 10,
        gap: 10,
      },

      searchInput: {
        flex: 1,
        fontSize: 16,

      },

      todoContainer: {
        backgroundColor: "#fff",
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        marginBottom: 10,

      },

      todoInfoContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
      },

      todoText: {
        fontSize: 16,
        color: '#333'
      },

      footer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 20

      },

      newTodoInput:{
        flex:1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        fontSize: 16,
        color: "#333"

      },

      addButton:{
        backgroundColor: "#4630EB",
        padding: 8,
        borderRadius: 10,
        marginLeft: 20,
      }
})