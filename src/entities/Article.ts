import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	BeforeUpdate,
	Index,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Tag } from './Tag';

@Entity('articles')
export class Article {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index({ unique: true })
	@Column()
	slug!: string;

	@Column()
	title!: string;

	@Column({ default: '' })
	description!: string;

	@Column({ default: '' })
	body!: string;

	@ManyToMany(() => Tag, (tag: Tag) => tag.articles, { eager: true, cascade: true })
	@JoinTable()
	tagList!: Tag[];

	@ManyToOne(() => User, (user: User) => user.articles, { eager: true })
	author!: User;

	@OneToMany(() => Comment, (comment: Comment) => comment.article)
	comments!: Comment[];

	@ManyToMany(() => User)
	favorites!: User[];

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt!: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt!: Date;

	@BeforeUpdate()
	updateTimestamp() {
		this.updatedAt = new Date();
	}

	toJSON(following: boolean, favorited: boolean, favoritesCount: number) {
		return {
			article: {
				slug: this.slug,
				title: this.title,
				description: this.description,
				body: this.body,
				tagList: this.tagList.map((tag: Tag) => tag.toJSON()),
				author: this.author.toProfileJSON(following).profile,
				createdAt: this.createdAt,
				updatedAt: this.updatedAt,
				favorited,
				favoritesCount,
			},
		};
	}
}
