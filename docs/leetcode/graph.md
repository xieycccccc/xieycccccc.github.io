# 图论

## 介绍
图是一种数据结构，由节点（顶点）和连接节点的边组成。图可以是有向的（边有方向）或无向的（边没有方向）。图论是研究图的性质、算法和应用的数学领域。


### 200 岛屿数量
第一道图论题目，一开始的直接思路是搞个岛屿列表，遍历每个岛屿，看看它的上下左右有没有相邻的岛屿，如果有就合并成一个岛屿。这个思路应该可以，但是写起来很烦，不如答案的思路了，就是直接遍历每个格子，如果是陆地，就把它周围的陆地都变成水，这样就相当于把一个岛屿变成了一个水域，最后统计岛屿数量就好了。

思路的实现就是使用DFS或者BFS来遍历每个陆地格子，把它周围的陆地格子都变成水，这样就相当于把一个岛屿变成了一个水域，最后统计岛屿数量就好了。


```cpp
class Solution {
public:
    void dfs(vector<vector<char>>& grid, int i, int j) {
        if (grid[i][j] != '1') {
            return;
        }
        grid[i][j] = '0';
        if (i - 1 >= 0 && grid[i - 1][j] == '1') {
            dfs(grid, i - 1, j);
        }
        if (i + 1 < grid.size() && grid[i + 1][j] == '1') {
            dfs(grid, i + 1, j);
        }
        if (j - 1 >= 0 && grid[i][j - 1] == '1') {
            dfs(grid, i, j - 1);
        }
        if (j + 1 < grid[0].size() && grid[i][j + 1] == '1') {
            dfs(grid, i, j + 1);
        }
    }
    int numIslands(vector<vector<char>>& grid) {
        int m = grid.size();
        int n = grid[0].size();

        int ans = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    ans++;
                    dfs(grid, i, j);
                }
            }
        }
        return ans;
    }
};
```

这个消除的部分也可以用BFS来实现，思路是一样的，就是把一个岛屿变成一个水域，最后统计岛屿数量就好了。

```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int nr = grid.size();
        if (!nr) return 0;
        int nc = grid[0].size();

        int num_islands = 0;
        for (int r = 0; r < nr; ++r) {
            for (int c = 0; c < nc; ++c) {
                if (grid[r][c] == '1') {
                    ++num_islands;
                    grid[r][c] = '0';
                    queue<pair<int, int>> neighbors;
                    neighbors.push({r, c});
                    while (!neighbors.empty()) {
                        auto rc = neighbors.front();
                        neighbors.pop();
                        int row = rc.first, col = rc.second;
                        if (row - 1 >= 0 && grid[row-1][col] == '1') {
                            neighbors.push({row-1, col});
                            grid[row-1][col] = '0';
                        }
                        if (row + 1 < nr && grid[row+1][col] == '1') {
                            neighbors.push({row+1, col});
                            grid[row+1][col] = '0';
                        }
                        if (col - 1 >= 0 && grid[row][col-1] == '1') {
                            neighbors.push({row, col-1});
                            grid[row][col-1] = '0';
                        }
                        if (col + 1 < nc && grid[row][col+1] == '1') {
                            neighbors.push({row, col+1});
                            grid[row][col+1] = '0';
                        }
                    }
                }
            }
        }

        return num_islands;
    }
};

作者：LeetCode
链接：https://leetcode.cn/problems/number-of-islands/solutions/13103/dao-yu-shu-liang-by-leetcode/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

题解还给了一种并查集的解法，思路是把每个陆地格子看成一个节点，把相邻的陆地格子看成一条边，这样就可以把整个地图看成一个图，然后使用并查集来统计图中有多少个连通分量，也就是有多少个岛屿。


并查集是一种数据结构，用来处理一些不交集的合并及查询问题。它支持两种操作：find和union。find操作用来查找一个元素所在的集合，union操作用来合并两个集合。在本题中用这个结构，先初始化每个，然后不断合并，最后统计有多少个集合就好了。

```cpp 
class UnionFind {
public:
    UnionFind(vector<vector<char>>& grid) {
        count = 0;
        int m = grid.size();
        int n = grid[0].size();
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (grid[i][j] == '1') {
                    parent.push_back(i * n + j);
                    ++count;
                }
                else {
                    parent.push_back(-1);
                }
                rank.push_back(0);
            }
        }
    }

    int find(int i) {
        if (parent[i] != i) {
            parent[i] = find(parent[i]);
        }
        return parent[i];
    }

    void unite(int x, int y) {
        int rootx = find(x);
        int rooty = find(y);
        if (rootx != rooty) {
            if (rank[rootx] < rank[rooty]) {
                swap(rootx, rooty);
            }
            parent[rooty] = rootx;
            if (rank[rootx] == rank[rooty]) rank[rootx] += 1;
            --count;
        }
    }

    int getCount() const {
        return count;
    }

private:
    vector<int> parent;
    vector<int> rank;
    int count;
};

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int nr = grid.size();
        if (!nr) return 0;
        int nc = grid[0].size();

        UnionFind uf(grid);
        int num_islands = 0;
        for (int r = 0; r < nr; ++r) {
            for (int c = 0; c < nc; ++c) {
                if (grid[r][c] == '1') {
                    grid[r][c] = '0';
                    if (r - 1 >= 0 && grid[r-1][c] == '1') uf.unite(r * nc + c, (r-1) * nc + c);
                    if (r + 1 < nr && grid[r+1][c] == '1') uf.unite(r * nc + c, (r+1) * nc + c);
                    if (c - 1 >= 0 && grid[r][c-1] == '1') uf.unite(r * nc + c, r * nc + c - 1);
                    if (c + 1 < nc && grid[r][c+1] == '1') uf.unite(r * nc + c, r * nc + c + 1);
                }
            }
        }

        return uf.getCount();
    }
};

作者：LeetCode
链接：https://leetcode.cn/problems/number-of-islands/solutions/13103/dao-yu-shu-liang-by-leetcode/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```


### 994 腐烂的橘子
跟上一道差不多，但是循环的条件我用的是单轮的传染数，单轮传染数为0就是结束了，每轮就是正常的传染，但是为了防止刚被传染的要去传染别人，故使用了一个编码3，表示刚被传染的橘子，这样就可以在每轮结束的时候把它们变成2，表示已经腐烂的橘子了。

```cpp
class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int turn_count = 1;
        int ans = -1;

        int m = grid.size();
        int n = grid[0].size();

        bool success = true;
        while (turn_count != 0) {
            ans++;
            turn_count = 0;
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (grid[i][j] == 2) {
                        if (i - 1 >= 0 && grid[i - 1][j] == 1) {
                            turn_count++;
                            grid[i - 1][j] =
                                3; // 搞个别的编码，防止同一轮刚出来的就感染
                        }
                        if (i + 1 < m && grid[i + 1][j] == 1) {
                            turn_count++;
                            grid[i + 1][j] = 3;
                        }
                        if (j - 1 >= 0 && grid[i][j - 1] == 1) {
                            turn_count++;
                            grid[i][j - 1] = 3;
                        }
                        if (j + 1 < n && grid[i][j + 1] == 1) {
                            turn_count++;
                            grid[i][j + 1] = 3;
                        }
                    }
                }
            }
            // 恢复
            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (grid[i][j] == 3) {
                        grid[i][j] = 2;
                    }
                }
            }
        }
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1) {
                    success = false;
                }
            }
        }
        if (success) {
            return ans;
        } else {
            return -1;
        }
    };
};

```


标答是队列的，思路是一样的，就是把每轮新感染的橘子放到队列里，下一轮再从队列里取出来感染别人，这样就可以保证同一轮刚出来的不会感染别人了。

```cpp
class Solution {
    int cnt;
    int dis[10][10];
    int dir_x[4] = {0, 1, 0, -1};
    int dir_y[4] = {1, 0, -1, 0};
public:
    int orangesRotting(vector<vector<int>>& grid) {
        queue<pair<int, int>>Q;
        memset(dis, -1, sizeof(dis));
        cnt = 0;
        int n = (int)grid.size(), m = (int)grid[0].size(), ans = 0;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < m; ++j) {
                if (grid[i][j] == 2) {
                    Q.emplace(i, j);
                    dis[i][j] = 0;
                }
                else if (grid[i][j] == 1) {
                    cnt += 1;
                }
            }
        }
        while (!Q.empty()){
            auto [r, c] = Q.front();
            Q.pop();
            for (int i = 0; i < 4; ++i) {
                int tx = r + dir_x[i];
                int ty = c + dir_y[i];
                if (tx < 0|| tx >= n || ty < 0|| ty >= m || ~dis[tx][ty] || !grid[tx][ty]) {
                    continue;
                }
                dis[tx][ty] = dis[r][c] + 1;
                Q.emplace(tx, ty);
                if (grid[tx][ty] == 1) {
                    cnt -= 1;
                    ans = dis[tx][ty];
                    if (!cnt) {
                        break;
                    }
                }
            }
        }
        return cnt ? -1 : ans;
    }
};

作者：力扣官方题解
链接：https://leetcode.cn/problems/rotting-oranges/solutions/124765/fu-lan-de-ju-zi-by-leetcode-solution/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```



### 207 课程表
这题真没做出来，看答案发现是很经典的拓扑排序题，思路是把课程看成图中的节点，先把每个节点的入度统计出来，然后把入度为0的节点放到队列里，每次从队列里取出一个节点，把它的邻居的入度减1，如果邻居的入度变成0了，就把它放到队列里，最后如果所有节点都被取出来了，就说明没有环，返回true，否则说明有环，返回false。

```cpp
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // 构建邻接表
        vector<vector<int>> pres;
        pres.resize(numCourses);

        // 入度表
        vector<int> in_array;
        in_array.resize(numCourses);

        for (int i = 0; i < prerequisites.size(); i++) {
            pres[prerequisites[i][1]].push_back(prerequisites[i][0]);
            in_array[prerequisites[i][0]]++;
        }

        deque<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (in_array[i] == 0) {
                q.push_back(i);
            }
        }
        int process = 0 ;

        while (!q.empty()) {
            process++;
            int u = q.front();
            q.pop_front();
            for (int i = 0 ;i< pres[u].size();i++){
                in_array[pres[u][i]]--;
                if (in_array[pres[u][i]]==0){
                    q.push_back(pres[u][i]);
                }
            }
        }
        return process==numCourses;

    }
};
```

DFS的3色标记法也可以用来判断图中是否有环，思路是把每个节点标记为0，1，2三种状态，0表示未访问过，1表示正在访问，2表示已经访问过了，如果在DFS的过程中遇到了一个正在访问的节点，就说明有环了，返回false，否则就继续DFS，最后如果所有节点都被访问过了，就说明没有环了，返回true。

```cpp
class Solution {
public:
    bool dfs(vector<vector<int>>& pres, vector<int>& state,int i) {
        if (state[i] == 1) {
            return false;
        }
        if (state[i] == 2) {
            return true;
        }

        state[i] = 1;
        for (int j = 0; j < pres[i].size(); j++) {
            if (!dfs(pres,state,pres[i][j])) {
                return false;
            }
        }
        state[i] = 2;
        return true;
    }
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // 构建邻接表
        vector<vector<int>> pres;
        pres.resize(numCourses);

        for (int i = 0; i < prerequisites.size(); i++) {
            pres[prerequisites[i][1]].push_back(prerequisites[i][0]);
        }

        vector<int> state;
        state.resize(numCourses);

        for (int i = 0; i < numCourses; i++) {
            if (!dfs(pres,state,i)) {
                return false;
            }
        }
        return true;
    }
};
```


### 208 实现 Trie (前缀树)

这题...真没想出来，不过看完答案后感觉这个string只由26个小写字母组成是关键

答案思路好巧妙，是一个类似26叉树，插入时不断扩展，查询时不断往下走，如果走到最后了还没有找到，就说明没有这个单词了，前缀也是一样的


```cpp
class Trie {
    //在private 里面，安全
private:
    bool isend;
    Trie* next[26];//初始化指针数组，避免野指针问题
public:
    Trie() {
        isend = false;
        memset(next, 0, sizeof(next));
    }

    void insert(string word) {
        Trie* node = this;
        for (char s : word) {
            
            
            s -= 'a';
            if (node->next[s]==NULL){
                node->next[s] = new Trie();
            }
            node = node->next[s];
        }
        node->isend = true;
    }

    bool search(string word) {

        Trie* node = this ;
        for (char s:word){
            s -='a';
            if  (node->next[s]==NULL){
                return false;
            }
            node = node->next[s];
        }
        return node->isend;

    }

    bool startsWith(string prefix) {
        Trie* node = this ;
        for (char s:prefix){
            s -='a';
            node = node->next[s];
            if (node==NULL){
                return false;
            }
        }
        return true;
    }
};

/**
 * Your Trie object will be instantiated and called as such:
 * Trie* obj = new Trie();
 * obj->insert(word);
 * bool param_2 = obj->search(word);
 * bool param_3 = obj->startsWith(prefix);
 */
```
