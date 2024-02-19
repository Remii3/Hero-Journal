import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import TodoForm from '../../components/Todo/TodoForm';
import ToDoList from '../../components/Todo/TodoList';
import { TodoTask, User } from '../../types/types';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

const fetchTodos = async (user: User) => {
  try {
    const db = getFirestore();
    const q = query(
      collection(db, 'todo'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(q);
    const todos = querySnapshot.docs.map((doc) => {
      const docData = doc.data() as TodoTask;
      return {
        id: doc.id,
        title: docData.title,
        status: docData.status,
        difficulty: docData.difficulty,
      };
    });
    return todos;
  } catch (err) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const uploadNewTodo = async (todo: TodoTask) => {
  const db = getFirestore();

  try {
    const docRef = await addDoc(collection(db, 'todo'), todo);
    return docRef.id;
  } catch (err: unknown) {
    return Promise.reject(new Error((err as Error).message));
  }
};

const finishTodo = async (
  id: string,
  uid: string,
  status: TodoTask['status'],
  difficulty: TodoTask['difficulty'],
) => {
  const db = getFirestore();
  const todoRef = doc(db, 'todo', id);
  const userRef = doc(db, 'users', uid);
  await updateDoc(todoRef, {
    status: status,
  });

  const incrementValue = status === 'done' ? 1 : -1;

  await updateDoc(userRef, {
    [`todos.done.quantity.${difficulty}`]: increment(incrementValue),
  });
};

export default function TodoScreen() {
  const [showNewTodo, setShowNewTodo] = useState(false);

  const newTodoFormVisibilityHandler = (visible: boolean) => {
    setShowNewTodo(visible);
  };

  return (
    <View>
      <TodoForm
        newTodoFormVisibilityHandler={newTodoFormVisibilityHandler}
        showNewTodo={showNewTodo}
        uploadNewTodo={uploadNewTodo}
      />
      <View>
        <Button title="+" onPress={() => newTodoFormVisibilityHandler(true)} />
      </View>
      <View>
        <ToDoList fetchTodos={fetchTodos} finishTodo={finishTodo} />
      </View>
      <Text>TasksScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
