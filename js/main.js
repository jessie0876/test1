// 生命树应用主逻辑
class LifeTreeApp {
    constructor() {
        this.currentUser = null;
        this.selectedNodes = [];
        this.posts = [];
        this.currentTrunk = null;
        
        // 预定义的生命节点
        this.trunkNodes = {
            1: [
                { id: '1-1', title: '第一次上学' },
                { id: '1-2', title: '学会骑车' },
                { id: '1-3', title: '毕业典礼' }
            ],
            2: [
                { id: '2-1', title: '第一份工作' },
                { id: '2-2', title: '升职加薪' },
                { id: '2-3', title: '创业经历' }
            ],
            3: [
                { id: '3-1', title: '初恋时光' },
                { id: '3-2', title: '结婚典礼' },
                { id: '3-3', title: '为人父母' }
            ],
            4: [
                { id: '4-1', title: '学习乐器' },
                { id: '4-2', title: '旅行经历' },
                { id: '4-3', title: '培养爱好' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.loadUserData();
    }
    
    bindEvents() {
        // 注册表单提交
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
        
        // 退出按钮
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }
        
        // 返回生命树按钮
        const backToTreeBtn = document.getElementById('backToTreeBtn');
        if (backToTreeBtn) {
            backToTreeBtn.addEventListener('click', () => {
                this.showMainPage();
            });
        }
        
        // 发布按钮
        const postBtn = document.getElementById('postBtn');
        if (postBtn) {
            postBtn.addEventListener('click', () => {
                this.handlePost();
            });
        }
        
        // 为主干添加点击事件
        document.querySelectorAll('.trunk').forEach(trunk => {
            trunk.addEventListener('click', (e) => {
                const trunkId = trunk.dataset.trunk;
                this.showTrunkNodes(trunkId);
            });
        });
    }
    
    handleRegister() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (password.length !== 6) {
            alert('密码必须是6位数');
            return;
        }
        
        // 保存用户信息到本地存储
        this.currentUser = {
            username: username,
            password: password // 在实际应用中应该加密
        };
        
        localStorage.setItem('lifeTreeUser', JSON.stringify(this.currentUser));
        
        // 显示主页面
        this.showMainPage();
    }
    
    loadUserData() {
        const savedUser = localStorage.getItem('lifeTreeUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            // 如果已有用户数据，直接显示主页面
            this.showMainPage();
        }
    }
    
    showMainPage() {
        document.getElementById('registerPage').classList.add('hidden');
        document.getElementById('communityPage').classList.add('hidden');
        document.getElementById('mainPage').classList.remove('hidden');
        
        if (this.currentUser) {
            document.getElementById('currentUsername').textContent = this.currentUser.username;
        }
        
        // 重置生命树显示
        this.hideAllBranches();
    }
    
    showCommunityPage() {
        document.getElementById('registerPage').classList.add('hidden');
        document.getElementById('mainPage').classList.add('hidden');
        document.getElementById('communityPage').classList.remove('hidden');
        
        if (this.currentUser) {
            document.getElementById('communityUsername').textContent = this.currentUser.username;
        }
        
        // 显示当前节点的标题
        if (this.currentTrunk) {
            const trunkLabels = {
                1: '成长',
                2: '事业',
                3: '情感',
                4: '兴趣'
            };
            document.getElementById('communityTitle').textContent = 
                `${trunkLabels[this.currentTrunk]} - 树枝社区`;
        }
        
        this.renderPosts();
    }
    
    showTrunkNodes(trunkId) {
        this.currentTrunk = trunkId;
        
        // 隐藏所有其他分支
        this.hideAllBranches();
        
        // 显示当前主干的节点
        const branches = document.querySelector(`.branches-${trunkId}`);
        branches.classList.add('active');
        
        // 清空并重新添加节点
        branches.innerHTML = '';
        
        this.trunkNodes[trunkId].forEach((node, index) => {
            const nodeElement = document.createElement('div');
            nodeElement.className = `node node-${index + 1}`;
            nodeElement.dataset.nodeId = node.id;
            nodeElement.dataset.nodeTitle = node.title;
            nodeElement.textContent = index + 1;
            
            // 检查是否已选择该节点
            if (this.selectedNodes.includes(node.id)) {
                nodeElement.classList.add('selected');
            }
            
            nodeElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectNode(node.id, node.title);
            });
            
            branches.appendChild(nodeElement);
        });
    }
    
    hideAllBranches() {
        document.querySelectorAll('.branches').forEach(branches => {
            branches.classList.remove('active');
        });
    }
    
    selectNode(nodeId, nodeTitle) {
        // 如果节点已被选中，则取消选择
        const index = this.selectedNodes.indexOf(nodeId);
        if (index > -1) {
            this.selectedNodes.splice(index, 1);
        } else {
            this.selectedNodes.push(nodeId);
        }
        
        // 更新节点显示状态
        const nodeElement = document.querySelector(`.node[data-node-id="${nodeId}"]`);
        if (nodeElement) {
            nodeElement.classList.toggle('selected');
        }
        
        // 如果当前主干有至少一个节点被选中，跳转到社区页面
        const currentTrunkNodes = this.trunkNodes[this.currentTrunk];
        const selectedCurrentTrunkNodes = currentTrunkNodes.filter(node => 
            this.selectedNodes.includes(node.id)
        );
        
        if (selectedCurrentTrunkNodes.length > 0) {
            // 保存选中的节点到本地存储
            localStorage.setItem('lifeTreeSelectedNodes', JSON.stringify(this.selectedNodes));
            this.showCommunityPage();
        }
    }
    
    handleLogout() {
        this.currentUser = null;
        this.selectedNodes = [];
        this.currentTrunk = null;
        
        localStorage.removeItem('lifeTreeUser');
        localStorage.removeItem('lifeTreeSelectedNodes');
        
        // 显示注册页面
        document.getElementById('mainPage').classList.add('hidden');
        document.getElementById('communityPage').classList.add('hidden');
        document.getElementById('registerPage').classList.remove('hidden');
        
        // 清空表单
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
    
    handlePost() {
        const postContent = document.getElementById('postContent').value.trim();
        if (!postContent) {
            alert('请输入内容');
            return;
        }
        
        const newPost = {
            id: Date.now(),
            userId: this.currentUser.username,
            content: postContent,
            nodeId: this.currentTrunk, // 使用当前主干ID作为节点标识
            timestamp: new Date().toLocaleString(),
            likes: 0,
            liked: false
        };
        
        this.posts.unshift(newPost);
        
        // 保存到本地存储
        localStorage.setItem('lifeTreePosts', JSON.stringify(this.posts));
        
        // 清空输入框
        document.getElementById('postContent').value = '';
        
        // 重新渲染帖子
        this.renderPosts();
    }
    
    renderPosts() {
        const container = document.getElementById('postsContainer');
        if (!container) return;
        
        // 从本地存储加载帖子
        const savedPosts = localStorage.getItem('lifeTreePosts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        }
        
        container.innerHTML = '';
        
        if (this.posts.length === 0) {
            container.innerHTML = '<div class="no-posts">暂无帖子，快来分享你的感悟吧！</div>';
            return;
        }
        
        this.posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-header">
                    <span class="post-user">${post.userId}</span>
                    <span class="post-time">${post.timestamp}</span>
                </div>
                <div class="post-content">${post.content}</div>
                <div class="post-actions">
                    <button class="like-btn ${post.liked ? 'liked' : ''}" data-post-id="${post.id}">
                        👍 ${post.likes}
                    </button>
                    <button class="comment-btn" data-post-id="${post.id}">💬 评论 (${post.comments ? post.comments.length : 0})</button>
                </div>
                <div class="comments-section" id="comments-${post.id}" style="display: none;">
                    <div class="add-comment">
                        <input type="text" class="comment-input" placeholder="写下你的评论..." data-post-id="${post.id}">
                        <button class="add-comment-btn" data-post-id="${post.id}">发送</button>
                    </div>
                    <div class="comments-list" id="comments-list-${post.id}">
                        ${post.comments ? post.comments.map(comment => `
                            <div class="comment">
                                <span class="comment-user">${comment.userId}:</span>
                                <span class="comment-content">${comment.content}</span>
                                <span class="comment-time">${comment.timestamp}</span>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
            `;
            
            // 添加点赞事件
            const likeBtn = postElement.querySelector('.like-btn');
            likeBtn.addEventListener('click', () => {
                this.toggleLike(post.id);
            });
            
            // 添加评论按钮事件
            const commentBtn = postElement.querySelector('.comment-btn');
            commentBtn.addEventListener('click', (e) => {
                const postId = e.target.dataset.postId;
                this.toggleComments(postId);
            });
            
            // 添加评论输入框事件
            const commentInput = postElement.querySelector('.comment-input');
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const postId = e.target.dataset.postId;
                    this.addComment(postId);
                }
            });
            
            // 添加评论发送按钮事件
            const addCommentBtn = postElement.querySelector('.add-comment-btn');
            addCommentBtn.addEventListener('click', (e) => {
                const postId = e.target.dataset.postId;
                this.addComment(postId);
            });
            
            container.appendChild(postElement);
        });
    }
    
    toggleLike(postId) {
        const post = this.posts.find(p => p.id == postId);
        if (!post) return;
        
        if (post.liked) {
            post.likes--;
            post.liked = false;
        } else {
            post.likes++;
            post.liked = true;
        }
        
        // 保存到本地存储
        localStorage.setItem('lifeTreePosts', JSON.stringify(this.posts));
        
        // 重新渲染帖子
        this.renderPosts();
    }
    
    toggleComments(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        if (commentsSection.style.display === 'none' || !commentsSection.style.display) {
            commentsSection.style.display = 'block';
        } else {
            commentsSection.style.display = 'none';
        }
    }
    
    addComment(postId) {
        const commentInput = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
        const content = commentInput.value.trim();
        
        if (!content) {
            alert('请输入评论内容');
            return;
        }
        
        const post = this.posts.find(p => p.id == postId);
        if (!post) return;
        
        const newComment = {
            id: Date.now(),
            userId: this.currentUser.username,
            content: content,
            timestamp: new Date().toLocaleString()
        };
        
        if (!post.comments) {
            post.comments = [];
        }
        
        post.comments.unshift(newComment);
        
        // 保存到本地存储
        localStorage.setItem('lifeTreePosts', JSON.stringify(this.posts));
        
        // 清空输入框
        commentInput.value = '';
        
        // 重新渲染帖子
        this.renderPosts();
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new LifeTreeApp();
});