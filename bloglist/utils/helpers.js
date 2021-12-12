const dummy = (blogs) => 1;
const totalLikes = (blogsList) => {
  const reducer = (result, cur) => {
    return result + cur.likes;
  };
  return blogsList.reduce(reducer, 0);
};
const favouriteBlog = (blogsList) => {
  let likesList = [];
  blogsList.forEach((blog) => likesList.push(blog.likes));
  const mostLikes = Math.max(...likesList);
  return blogsList.filter((blog) => blog.likes === mostLikes)[0];
};
const mostBlogs = (blogsList) => {
  const blogCounts = {};
  blogsList.forEach((blog) => {
    if (blogCounts[blog.author]) {
      blogCounts[blog.author]++;
      return;
    }
    blogCounts[blog.author] = 1;
  });
  const authorBlogCount = Math.max(...Object.values(blogCounts));
  for (let author in blogCounts) {
    if (blogCounts[author] === authorBlogCount) {
      return {
        author: author,
        blogs: authorBlogCount,
      };
    }
  }
};
const mostLikes = (blogsList) => {
  const authorLikesList = {};
  blogsList.forEach((blog) => {
    if (!authorLikesList[blog.author]) {
      authorLikesList[blog.author] = blog.likes;
      return;
    }
    authorLikesList[blog.author] += blog.likes;
  });
  const mostLikes = Math.max(...Object.values(authorLikesList));
  for (let author in authorLikesList) {
    if (authorLikesList[author] === mostLikes) {
      return { author: author, likes: authorLikesList[author] };
    }
  }
};
module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
