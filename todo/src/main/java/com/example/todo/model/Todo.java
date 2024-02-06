package com.example.todo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//コンストラクタ、ゲッター、セッター
@Getter
@Setter
@NoArgsConstructor // Lombokによるデフォルトコンストラクタの自動生成
@Entity

/**
 * 
 * @param id エンティティの主キーとして指定し、データベースによって自動生成されることを指示
 * @param GeneratedValue 
 * @param NotBlank name nameが空白、この制約に違反した場合は指定されたメッセージが表示
 * @param NotBlank content contentが空白、この制約に違反した場合は指定されたメッセージが表示
 *
 */
public class Todo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank(message = "名前は必須です。")
	private String name;
	
	@NotBlank(message = "内容は必須です。")
	private String content;
}