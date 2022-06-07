// @mui
import { Grid, Typography } from '@mui/material';
// @types
import { Post } from '../../../@types/blog';
//
import BlogPostCard from './BlogPostCard';

// ----------------------------------------------------------------------

type Props = {
  posts: Post[];
};

export default function BlogPostRecent({ posts }: Props) {
  return (
    <>
      <Typography variant="h4" sx={{ mt: 10, mb: 5 }}>
        Recent posts
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid key={post.id} item xs={12} sm={6} md={3}>
            <BlogPostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
