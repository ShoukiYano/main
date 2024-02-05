package com.example.todo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;

@RestController
@RequestMapping("/api/todos")
public class TodoController {	
	@Autowired
	private TodoRepository todoRepository;
	
	@GetMapping
	public List<Todo> getAllTodos() {
		return todoRepository.findAll();
	}
	
	@PostMapping
	public Todo createTodo(@RequestBody Todo todo) {
		return todoRepository.save(todo);
	}
	
	@GetMapping("/{id}")
	public Todo getTodoById(@PathVariable Long id) {
		return todoRepository.findById(id).orElseThrow();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
	    return todoRepository.findById(id)
	            .map(todo -> {
	                todo.setName(todoDetails.getName());
	                todo.setContent(todoDetails.getContent());
	                todoRepository.save(todo);
	                return ResponseEntity.ok(todo);
	            })
	            .orElse(ResponseEntity.notFound().build());
	}

	
	@DeleteMapping("/{id}") 
		public void deleteTodo(@PathVariable Long id) {
			todoRepository.deleteById(id);
		}
	}

