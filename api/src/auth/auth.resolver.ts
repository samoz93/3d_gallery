import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Public } from '@samoz/utils/auth.roles';
const posts = [
  {
    id: 1,
    title: 'Post 1',
    content: 'Content 1',
    votes: 1,
  },
  {
    id: 2,
    title: 'Post 2',
    content: 'Content 2',
  },
];

const authors = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    posts: [1],
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    posts: [1, 2],
  },
];
@Resolver('Author')
@Public()
export class AuthResolver {
  // constructor(private pubSub: PubSub) {}

  @Query('author')
  async getAuthor(@Args('id') id: number) {
    return authors.find((author) => author.id === id);
  }

  @ResolveField('posts')
  async getPosts(@Parent() author: (typeof authors)[0]) {
    return author.posts.map((postId) =>
      posts.find((post) => post.id === postId),
    );
  }

  @Mutation('upvotePost')
  async upvotePost(@Args('postId') postId: number) {
    const oldVoute = posts.find((post) => post.id === postId).votes || 0;
    const post = posts.find((post) => post.id === postId);
    post.votes = oldVoute + 1;
    return post;
  }

  // @Subscription('upvotePost')
  // commentAdded() {
  //   return pubSub.asyncIterator('upvotePost');
  // }
}
