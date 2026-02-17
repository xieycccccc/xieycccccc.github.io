# 二叉树

## 介绍
二叉树是一种树形数据结构，其中每个节点最多有两个子节点，通常称为左子节点和右子节点。二叉树在计算机科学中有广泛的应用，包括表达式解析、排序算法和搜索算法等。

### 94 . 二叉树的中序遍历

方法一：
由于二叉树有很好的递归性质，很多遍历方法都可以用递归来实现。中序遍历的顺序是：先遍历左子树，然后访问根节点，最后遍历右子树。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    void mid_order(TreeNode* root,vector<int>& ans){
        if (root==nullptr){
            return ;
        }
        mid_order(root->left,ans);
        ans.push_back(root->val);
        mid_order(root->right,ans);
    }
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int > ans ;
        mid_order(root,ans);
        return ans;
    }
};
```

方法二：
利用栈来模拟递归过程，实现中序遍历。
```cpp
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> res;
        stack<TreeNode*> stk;
        while (root != nullptr || !stk.empty()) {
            while (root != nullptr) {
                stk.push(root);
                root = root->left;
            }
            root = stk.top();
            stk.pop();
            res.push_back(root->val);
            root = root->right;
        }
        return res;
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/binary-tree-inorder-traversal/solutions/412886/er-cha-shu-de-zhong-xu-bian-li-by-leetcode-solutio/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

方法三：Morris遍历
太神秘了这个方法
Morris遍历是一种不使用栈或递归的中序遍历方法，通过修改树的结构来实现。
他的基本思想是：对于当前节点，如果它有左子节点，则找到其左子树的最右节点，将该节点的右指针指向当前节点，然后将当前节点移动到左子节点。否则，访问当前节点并将其移动到右子节点。
```cpp
class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> res;
        TreeNode *predecessor = nullptr;

        while (root != nullptr) {
            if (root->left != nullptr) {
                // predecessor 节点就是当前 root 节点向左走一步，然后一直向右走至无法走为止
                predecessor = root->left;
                while (predecessor->right != nullptr && predecessor->right != root) {
                    predecessor = predecessor->right;
                }
                
                // 让 predecessor 的右指针指向 root，继续遍历左子树
                if (predecessor->right == nullptr) {
                    predecessor->right = root;
                    root = root->left;
                }
                // 说明左子树已经访问完了，我们需要断开链接
                else {
                    res.push_back(root->val);
                    predecessor->right = nullptr;
                    root = root->right;
                }
            }
            // 如果没有左孩子，则直接访问右孩子
            else {
                res.push_back(root->val);
                root = root->right;
            }
        }
        return res;
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/binary-tree-inorder-traversal/solutions/412886/er-cha-shu-de-zhong-xu-bian-li-by-leetcode-solutio/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

### 104 . 二叉树的最大深度
方法一：
直接上递归，令人遗憾的是我并没有想到，感觉递归的思路还是不够清晰，本题的递归思路是：我们需要解决的是当前节点的最大深度问题，而当前节点的最大深度取决于它的左子节点和右子节点的最大深度，因此我们可以递归地计算左子节点和右子节点的最大深度，然后取较大值加一即可。
而返回条件也很简单，当节点为空时，深度为0。
```cpp
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root ==nullptr){
            return 0;
        }
        return max(maxDepth(root->left),maxDepth(root->right))+1;
    }
};
```

方法二：
利用层序遍历来计算二叉树的最大深度。每遍历一层，深度加一。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (root ==nullptr){
            return 0;
        }

        int ans = 0;
        queue<TreeNode* >Q;
        Q.push(root);
        while (!Q.empty()){
            int all = Q.size();
            while (all>0){
                TreeNode* node = Q.front();
                Q.pop();
                if (node->left) Q.push(node->left);
                if (node->right) Q.push(node->right);
                all--;
            }
            ans++;
        }
        return ans;
    }
};
```

### 226 . 翻转二叉树
终于写出来了递归，其实就是不要像递归的子过程，直接想我这一步需要做什么，这题就是交换左右子节点，然后对左右子树的翻转，然后终止条件就是节点空
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root){
            return nullptr;
        }
        invertTree(root->left);
        invertTree(root->right);
        TreeNode* temp = root->left;
        root->left = root->right;
        root->right = temp;
        return root;
    }
};
```

### 101 . 对称二叉树
方法一：递归
又写出来一个递归题，递归的思路就是比较两个节点是否相等，然后比较左子节点的左子节点和右子节点的右子节点是否相等，左子节点的右子节点和右子节点的左子节点是否相等

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    bool isSymmetric_help(TreeNode* left, TreeNode* right) {
        if (left == nullptr && right == nullptr) {
            return true;
        } else if (left == nullptr || right == nullptr) {
            return false;
        }
        if (left->val == right->val) {
            return isSymmetric_help(left->left, right->right) &&
                   isSymmetric_help(left->right, right->left);

        } else {
            return false;
        }
    }
    bool isSymmetric(TreeNode* root) {
        return isSymmetric_help(root->left, root->right);
    }
};
```

方法二：迭代
使用队列来实现迭代的方法，思路和递归类似，每次从队列中取出两个节点进行比较，然后将它们的子节点按对称顺序加入队列。
```cpp
class Solution {
public:
    bool check(TreeNode *u, TreeNode *v) {
        queue <TreeNode*> q;
        q.push(u); q.push(v);
        while (!q.empty()) {
            u = q.front(); q.pop();
            v = q.front(); q.pop();
            if (!u && !v) continue;
            if ((!u || !v) || (u->val != v->val)) return false;

            q.push(u->left); 
            q.push(v->right);

            q.push(u->right); 
            q.push(v->left);
        }
        return true;
    }

    bool isSymmetric(TreeNode* root) {
        return check(root, root);
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/symmetric-tree/solutions/268109/dui-cheng-er-cha-shu-by-leetcode-solution/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

### 543 . 二叉树的直径
非常好竟然又做出了一道递归题，递归的思路是：我们需要的信息有两个，一个是当前节点的最大深度，另一个是当前节点的直径。当前节点的直径等于左子节点的最大深度加上右子节点的最大深度。因此我们可以通过递归地计算左子节点和右子节点的最大深度，同时更新全局变量来记录最大的直径。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    
    int diameterOfBinaryTree_help(TreeNode* root ,int& ans) {
        if (root==nullptr){
            return 0;
        }
        int l = diameterOfBinaryTree_help(root->left,ans);
        int r = diameterOfBinaryTree_help(root->right,ans);
        ans = max(ans,l+r);
        return max(l,r)+1;
    }
    
    int diameterOfBinaryTree(TreeNode* root) {
        int d = 0;
        diameterOfBinaryTree_help(root,d);
        return d;
    }
};
```


### 102 . 二叉树的层序遍历
直接队列层级遍历，前几题做过
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {

        queue<TreeNode*> q;
        vector<vector<int>> ans;
        if (!root){
            return ans;
        }

        q.push(root);
        vector<int> temp;
        while (!q.empty()) {
            temp.clear();
            int layer_sum = q.size();
            while (layer_sum > 0) {
                TreeNode* cur = q.front();
                q.pop();
                temp.push_back(cur->val);
                if (cur->left) {
                    q.push(cur->left);
                }
                if (cur->right) {
                    q.push(cur->right);
                }
                layer_sum--;
            }
            ans.push_back(temp);
        }
        return ans;
    };
};
```

### 108 . 将有序数组转换为二叉搜索树
又是经典的递归，思路是：我们需要将有序数组转换为高度平衡的二叉搜索树。为了保持树的平衡，我们可以选择数组的中间元素作为根节点，然后递归地对左半部分和右半部分构建左子树和右子树。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    TreeNode* sortedArrayToBST_help(vector<int>& nums, int left, int right) {
        if (right < left) {
            return nullptr;
        }
        int mid = (left + right) / 2;
        TreeNode* mid_node = new TreeNode(nums[mid]);
        mid_node->left = sortedArrayToBST_help(nums, left, mid - 1);
        mid_node->right = sortedArrayToBST_help(nums, mid + 1, right);
        return mid_node;
    }
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        int left = 0;
        int right = nums.size() - 1;
        TreeNode* ans = sortedArrayToBST_help(nums, left, right);
        return ans;
    }
};
```


### 98 . 验证二叉搜索树
上一题是构建二叉搜索树，这题是验证二叉搜索树，思路是：对于每个节点，我们需要确保它的值在一个合法的范围内。初始时，根节点的值可以是任意值，因此范围是负无穷到正无穷。对于左子节点，值必须小于父节点的值，因此更新上界；对于右子节点，值必须大于父节点的值，因此更新下界。递归地检查每个节点是否满足这个条件。
注意题目中的"节点的值范围为32位有符号整数"，所以边界值使用long long类型。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:

    bool isValidBST_help(TreeNode* root,long long low ,long long high){
        if (!root){
            return true;
        }
        if (root->val<=low ||root->val>=high){
            return false;
        }

        return isValidBST_help(root->left,low,root->val)&&isValidBST_help(root->right,root->val,high);

    }

    bool isValidBST(TreeNode* root) {
        return isValidBST_help(root,LONG_MIN,LONG_MAX);
    }
};
```


### 230 . 二叉搜索树中第K小的元素
方法一：中序遍历
利用二叉搜索树的中序遍历特性，即中序遍历的结果是一个有序序列。我们可以进行中序遍历，并在遍历过程中计数，当计数达到k时，返回当前节点的值。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        int ans = 0;
        stack<TreeNode*> stk;
        int count = 0;
        while (root != nullptr || !stk.empty()) {
            while (root != nullptr) {
                stk.push(root);
                root = root->left;
                
            }
            count++;
            root = stk.top();
            if (count==k){
                return root->val;
            }
            stk.pop();
            root = root->right;
        }

        return ans;
    }
};
```


### 199 . 二叉树的右视图
方法一：层序遍历
直接层序遍历，每层的最后一个节点就是右视图中的节点。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {

        vector<int> ans;
        if (!root) {
            return ans;
        }
        queue<TreeNode*> q;
        q.push(root);
        vector<vector<int>> layer_list;
        vector<int> layer;

        while (!q.empty()) {
            int all = q.size();
            layer.clear();
            for (int i = 0; i < all; i++) {
                TreeNode* node = q.front();
                layer.push_back(node->val);
                q.pop();
                if (node->left) {
                    q.push(node->left);
                }
                if (node->right) {
                    q.push(node->right);
                }
            }
            layer_list.push_back(layer);
        }

        for (int i = 0; i < layer_list.size(); i++) {
            ans.push_back(layer_list[i][layer_list[i].size() - 1]);
        }
        return ans;
    }
};
```

方法二：DFS
先访问右子节点，每个层的第一个节点就是右视图中的节点,简单递归一下就好了
```cpp
class Solution {
public:
    vector<int> ans;
    void dfs(TreeNode* root,int layer){
        if (!root){
            return ;
        }if (ans.size()<layer){
            ans.push_back(root->val);
        }
        dfs(root->right,layer+1);
        dfs(root->left,layer+1);
    }

    vector<int> rightSideView(TreeNode* root) {
        dfs(root,1);
        return ans;
    }
};
```

### 114 . 二叉树展开为链表
方法一：前序遍历+一次遍历
使用栈的前序遍历二叉树，并将节点按访问顺序存储在一个列表中。然后，我们遍历这个列表，将每个节点的左子节点设置为null，右子节点设置为下一个节点，从而将二叉树展开为链表。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    void flatten(TreeNode* root) {
        if (!root) {
            return;
        }
        stack<TreeNode*> stk;
        vector<TreeNode*> L;
        stk.push(root);
        while (!stk.empty()) {
            TreeNode* cur = stk.top();
            stk.pop();
            L.push_back(cur);

            if (cur->right) {
                stk.push(cur->right);
            }
            if (cur->left) {
                stk.push(cur->left);
            }
        }

        for (int i = 0; i < L.size()-1; i++) {
            TreeNode* last = L[i];
            TreeNode* cur = L[i+1];
            last->left = nullptr;
            last->right = cur ;
        }
    }
};
```

方法二：前序遍历和展开同时进行
使用pre指针来记录前一个访问的节点，在前序遍历过程中直接修改节点的指针，使得树逐渐展开为链表。
```cpp
class Solution {
public:
    void flatten(TreeNode* root) {
        if (root == nullptr) {
            return;
        }
        auto stk = stack<TreeNode*>();
        stk.push(root);
        TreeNode *prev = nullptr;
        while (!stk.empty()) {
            TreeNode *curr = stk.top(); stk.pop();
            if (prev != nullptr) {
                prev->left = nullptr;
                prev->right = curr;
            }
            TreeNode *left = curr->left, *right = curr->right;
            if (right != nullptr) {
                stk.push(right);
            }
            if (left != nullptr) {
                stk.push(left);
            }
            prev = curr;
        }
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/solutions/356853/er-cha-shu-zhan-kai-wei-lian-biao-by-leetcode-solu/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

方法三：寻找前驱节点
使用Morris遍历的思想，在遍历过程中寻找当前节点左子树的前驱节点（最右边的），并将前驱节点的右指针指向当前节点的右子树，从而实现原地展开。
```cpp
class Solution {
public:
    void flatten(TreeNode* root) {
        TreeNode *curr = root;
        while (curr != nullptr) {
            if (curr->left != nullptr) {
                auto next = curr->left;
                auto predecessor = next;
                while (predecessor->right != nullptr) {
                    predecessor = predecessor->right;
                }
                predecessor->right = curr->right;
                curr->left = nullptr;
                curr->right = next;
            }
            curr = curr->right;
        }
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/solutions/356853/er-cha-shu-zhan-kai-wei-lian-biao-by-leetcode-solu/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

### 105 . 从前序与中序遍历序列构造二叉树
方法一：递归

前序遍历：中左右
中序遍历：左中右
我们的思路就是：前序遍历的第一个节点就是根节点，在中序遍历中找到这个根节点的位置，那么它左边的部分就是左子树，右边的部分就是右子树。然后我们可以递归地对左子树和右子树进行同样的操作，直到构建完整的二叉树。这题主要是索引很抽象
而且为了加速查找根节点在中序遍历中的位置，我们可以使用一个哈希表来存储中序遍历中每个值对应的索引，这样我们就可以在O(1)的时间内找到根节点的位置。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    unordered_map<int, int> index;
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {

        int n = preorder.size();
        for (int i = 0; i < preorder.size(); i++) {
            index[inorder[i]] = i;
        }
        return buildTree_help(preorder, inorder, 0, n - 1, 0, n - 1);
    }

    TreeNode* buildTree_help(vector<int>& preorder, vector<int>& inorder,
                             int preorder_left, int preorder_right,
                             int inorder_left, int inorder_right) {
        if (preorder_left > preorder_right) {
            return nullptr;
        }
        int inorder_mid = index[preorder[preorder_left]];

        int left_num = inorder_mid - inorder_left;
        TreeNode* root = new TreeNode(preorder[preorder_left]);
        root->left = buildTree_help(preorder, inorder, preorder_left + 1,
                                    preorder_left + left_num, inorder_left,
                                    inorder_mid - 1);
        root->right =
            buildTree_help(preorder, inorder, preorder_left + left_num + 1,
                           preorder_right, inorder_mid + 1, inorder_right);

        return root;
    }
};
```

方法二：迭代
神秘迭代法，还没咋看懂


### 437 . 路径总和 III
方法一：DFS
首先一个直观的想法是这题肯定是遍历树的每个节点，然后以每个节点为起点，计算所有路径的和，看看是否等于目标值。我们可以使用深度优先搜索（DFS）来实现，对于每个节点，先判断是不是目标值，如果是就计数加一，然后对左右子节点继续进行DFS，累加路径和或者传0表示开始新的路径。
但是这样的问题是会有不连续的路径，比如选取，不选取，选取，这样的非法路径，故想到了一个pick参数，表示当前路径是否已经选取了节点，如果已经选取了节点，那么后续的节点必须要选取，如果没有选取节点，那么后续的节点可以选择是否选取，这样就避免了不连续路径的问题。
最后测试时题目有很大的数阴了我们一手，直接修改了路径和的类型为long long，避免了整数溢出的问题。

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), lefat(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    int number = 0;
    void pathSum_help(TreeNode* root,long int now_Sum,long int targetSum, bool pick) {
        if (!root) {
            return;
        }
        if (now_Sum + root->val == targetSum) {
            //cout << root->val << endl;
            number++;
        }
        now_Sum = now_Sum + root->val;
        if (pick) {
            if (root->left) {
                pathSum_help(root->left, now_Sum, targetSum, true);
            }
            if (root->right) {
                pathSum_help(root->right, now_Sum, targetSum, true);
            }
        } else {
            if (root->left) {
                pathSum_help(root->left, now_Sum, targetSum,true);
                pathSum_help(root->left, 0, targetSum,false);
            }
            if (root->right) {
                pathSum_help(root->right, now_Sum,targetSum, true);
                pathSum_help(root->right, 0,targetSum, false);
            }
        }
        return;
    }

    int pathSum(TreeNode* root, int targetSum) {
        pathSum_help(root, 0, targetSum,false);
        return number;
    }
};
```

标答：
使用了一个辅助函数rootSum来计算以当前节点为起点的路径和等于目标值的路径数量。对于每个节点，我们先检查以该节点为起点的路径是否满足条件，然后递归地检查左子树和右子树。主函数pathSum则遍历每个节点，调用rootSum来计算以该节点为起点的路径数量，并累加结果。这个递归写法还是有点东西的。
```cpp
class Solution {
public:
    int rootSum(TreeNode* root, long long targetSum) {
        if (!root) {
            return 0;
        }

        int ret = 0;
        if (root->val == targetSum) {
            ret++;
        } 

        ret += rootSum(root->left, targetSum - root->val);
        ret += rootSum(root->right, targetSum - root->val);
        return ret;
    }

    int pathSum(TreeNode* root, int targetSum) {
        if (!root) {
            return 0;
        }
        
        int ret = rootSum(root, targetSum);
        ret += pathSum(root->left, targetSum);
        ret += pathSum(root->right, targetSum);
        return ret;
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/path-sum-iii/solutions/1021296/lu-jing-zong-he-iii-by-leetcode-solution-z9td/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

方法二：前缀和+哈希表
使用前缀和的思想，记录从根节点到当前节点的路径和，并使用一个哈希表来存储路径和出现的次数。对于每个节点，我们计算当前路径和，并检查是否存在一个之前的路径和，使得当前路径和减去这个之前的路径和等于目标值。如果存在，则说明从那个之前的节点到当前节点的路径和等于目标值，我们可以将计数器增加对应的次数。然后我们继续递归地遍历左右子树，最后在回溯时将当前路径和从哈希表中移除。


### 236 . 二叉树的最近公共祖先
寻找公共祖先，我想到的是从上往下找，判断p q是否在当前节点的左右子树中，如果在不同的子树中，那么当前节点就是最近公共祖先，如果在同一子树中，那么继续往下找，直到找到公共祖先或者找到其中一个节点。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Solution {
public:
    bool find_x(TreeNode* root, TreeNode* x) {
        if (!root) {
            return false;
        }
        if (root->val == x->val) {
            return true;
        }

        return find_x(root->left,x)||find_x(root->right,x);
    }

    TreeNode* lowestCommonAncestor_help(TreeNode* root, TreeNode* p,
                                        TreeNode* q) {
        if (root->val == p->val ||root->val ==q->val ){
            return root;
        }
        bool p_position = find_x(root->left, p);//
        bool q_position = find_x(root->left, q);

        if (p_position==q_position ){
            if (p_position==true){
                return lowestCommonAncestor_help(root->left,p,q);
            }else{
                return lowestCommonAncestor_help(root->right,p,q);
            }
        }else{
            return root;
        }
    }
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        return lowestCommonAncestor_help(root,p,q);
    }
};
```

标答：
```cpp
class Solution {
public:
    TreeNode* ans;
    bool dfs(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (root == nullptr) return false;
        bool lson = dfs(root->left, p, q);
        bool rson = dfs(root->right, p, q);
        if ((lson && rson) || ((root->val == p->val || root->val == q->val) && (lson || rson))) {
            ans = root;
        } 
        return lson || rson || (root->val == p->val || root->val == q->val);
    }
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        dfs(root, p, q);
        return ans;
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/solutions/238552/er-cha-shu-de-zui-jin-gong-gong-zu-xian-by-leetc-2/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

方法二：哈希存储
使用一个哈希表来存储每个节点的父节点，然后从p和q开始向上遍历，记录访问过的节点。当两个节点的祖先第一次相遇时，就是它们的最近公共祖先。
```cpp
class Solution {
public:
    unordered_map<int, TreeNode*> fa;
    unordered_map<int, bool> vis;
    void dfs(TreeNode* root){
        if (root->left != nullptr) {
            fa[root->left->val] = root;
            dfs(root->left);
        }
        if (root->right != nullptr) {
            fa[root->right->val] = root;
            dfs(root->right);
        }
    }
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        fa[root->val] = nullptr;
        dfs(root);
        while (p != nullptr) {
            vis[p->val] = true;
            p = fa[p->val];
        }
        while (q != nullptr) {
            if (vis[q->val]) return q;
            q = fa[q->val];
        }
        return nullptr;
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/solutions/238552/er-cha-shu-de-zui-jin-gong-gong-zu-xian-by-leetc-2/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

### 124 . 二叉树中的最大路径和

感觉难度不像hard,直接递归即可，只需要明白向上传递和max的计算的不同就好了，向上传递时只能是单边包含当前节点的路径和，并且若为负数直接丢掉，而max的是当前左右的路径和加上当前节点的值，和之前的最大路径和比较取较大值。
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left),
 * right(right) {}
 * };
 */
class Solution {
public:
    int max_val = -100000;
    int maxPathSum_help(TreeNode* root) {
        if (!root) {
            return 0;
        }
        int left_max = maxPathSum_help(root->left);
        int right_max = maxPathSum_help(root->right);
        // int now_val =
        //     max(left_max + root->val + right_max, root->val, left_max,
        //         right_max, root->val + left_max, root->val + right_max);

        int now_val = left_max + root->val + right_max;

        if (now_val > max_val) {
            max_val = now_val;
        }
        return max(max(left_max + root->val, right_max + root->val),0);
    }
    int maxPathSum(TreeNode* root) {
        maxPathSum_help(root);
        return max_val;
    }
};
```