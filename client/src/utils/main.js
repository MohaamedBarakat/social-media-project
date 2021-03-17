exports.handleDeletePost = (id) => {
    fetch('http://localhost:4000/post/' + id, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            //setPosts(data.posts.reverse());

        })
        //console.log(id);
}

exports.handleEditPost = (postId) => {
    //setIsEditPost(true);
    console.log(postId);
    fetch('http://localhost:4000/post/' + postId, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            //setEditPost(data.post.content);
        })
        .catch(err => {
            console.log(err);
        })

}
exports.handleLike = (id) => {
    console.log(id);
    fetch('http://localhost:4000/post/' + id + '/like', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            return res.json();
        })
        .then((data) => {
            let liked = false;
            data.post.likes.map(id => {
                if (id === localStorage.getItem('userId')) {
                    liked = true;
                }
            })
        })
}
exports.handleComment = (postId) => {
    //history.push('/post/' + postId);
}