# 双指针

## 介绍

双指针是一种常用的算法技巧，通常用于处理数组或字符串等线性数据结构。它涉及使用两个指针（或索引）来遍历数据结构，以实现高效的解决方案。

双指针技术主要分为以下两类：

1. **快慢指针**：一个指针移动得比另一个指针快，常用于检测链表中的环或寻找中间节点。
2. **左右指针**：两个指针分别从数据结构的两端向中间移动，常用于排序数组的合并、寻找目标和等问题。

## 题目解析

### 283. 移动零
**类型**：快慢指针

使用双指针，左指针指向当前已经处理好的序列的尾部，右指针指向待处理序列的头部。

```cpp
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int n = nums.size(), left = 0, right = 0;
        while (right < n) {
            if (nums[right]) {
                swap(nums[left], nums[right]);
                left++;
            }
            right++;
        }
    }
};
```

> 来源：[力扣官方题解](https://leetcode.cn/problems/move-zeroes/solutions/489622/yi-dong-ling-by-leetcode-solution/)

---

### 11. 盛最多水的容器
**类型**：左右指针

#### 初步尝试
一开始先是直接双重 `for` 循环但是时间不够，开始思考规律。想到可以先找到第一、第二大的两根柱子，然后分别向左右移动。左右移动扩展时，找左边或者右边最高的中更高的一根，直到左右指针到两个边界。虽然代码比较复杂，最后 debug 挺久后也是 AC 了。

```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int best = 0;
        int temp = 0;

        int best_left = 0;
        int best_right = 0;

        int i, j;

        int big1 = 0;
        int big2 = height.size() - 1;

        for (i = 0; i < height.size(); i++) {
            if (height[i] > height[big1]) {
                big1 = i;
            }
        }

        for (i = 0; i < height.size(); i++) {
            if (height[i] >= height[big2] && i != big1) {
                big2 = i;
            }
        }
        i = min(big1, big2);
        j = max(big1, big2);

        cout << i << j << endl;

        best = min(height[i], height[j]) * (j - i);

        while (!(i == 0 && j == height.size() - 1)) {
            best = max(min(height[i], height[j]) * (j - i), best);

            // 在左右两个小区间里找左max和右max来搞

            if (i > 0) {
                big1 = i - 1;
            } else {
                big1 = 0;
            }
            if (big2 < height.size() - 1) {
                big2 = j + 1;
            }else{
                big2 = height.size()-1;
            }
            for (int index = i - 1; index >= 0; index--) {
                if (height[index] >= height[big1]) {
                    big1 = index;
                }
            }

            for (int index = j + 1; index < height.size(); index++) {
                if (height[index] >= height[big2]) {
                    big2 = index;
                }
            }

            //cout << big1 << big2 << endl;

            if (i!=0&&height[big1] >= height[big2]||j == height.size()-1) {
                i = big1;
            } else if (i == 0 || (j!=height.size()-1&&height[big2] >= height[big1])) {
                j = big2;
            }

            //cout<<"i = "<<i<<"j= "<<j<<endl;
        }
        best = max(min(height[i], height[j]) * (j - i), best);
        return best;
    }
};
```

#### 优化解法（标准双指针）
原理：左右指针分别指向数组的两端，计算当前面积后，移动**较短**的那一边的指针，直到两个指针相遇。

从两端开始计算面积，当移动较短的边时，有可能找到更高的边，从而增加面积。如果移动较长的边，面积受限于较短的边且宽度减小，面积一定减少。因此，每次移动短边就像是“扔掉”了限制当前高度的短板，尝试寻找更好的机会。

```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1;
        int ans = 0;
        while (l < r) {
            int area = min(height[l], height[r]) * (r - l);
            ans = max(ans, area);
            if (height[l] <= height[r]) {
                ++l;
            }
            else {
                --r;
            }
        }
        return ans;
    }
};
```
> 来源：[力扣官方题解](https://leetcode.cn/problems/container-with-most-water/solutions/207215/sheng-zui-duo-shui-de-rong-qi-by-leetcode-solution/)

---

### 15. 三数之和
**类型**：左右指针

**解析**：
正常的想法是使用三重循环进行遍历，但是 O(N³) 复杂度过高，且处理重复解比较麻烦。

我们可以利用排序后的性质：
1.  首先对数组进行排序（升序）。
2.  遍历第一个数 `nums[i]`（作为三元组中的 `a`）。如果 `nums[i]` 和上一个数相同，跳过以去重。
3.  对于剩下的两个数 `nums[j]` (b) 和 `nums[k]` (c)，在 `[i+1, n-1]` 区间内使用**双指针**：
    *   计算 `sum = nums[i] + nums[j] + nums[k]`。
    *   如果 `sum == 0`，记录解，并将左右指针分别向内移动，同时跳过重复的数值。
    *   如果 `sum < 0`，说明需要更大的数，左指针 `j` 右移。
    *   如果 `sum > 0`，说明需要更小的数，右指针 `k` 左移。

```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // 先排个序吧
        vector<vector<int>> ans;
        sort(nums.begin(), nums.end());

        for (int i = 0; i < nums.size(); i++) {
            // 先到一个不重复的值上或者是第一个
            if (i == 0 || nums[i] != nums[i - 1]) {
                int j = i + 1;
                int k = nums.size() - 1;
                while (j < k) {
                    if (nums[j] + nums[k] == -nums[i]) {
                        ans.push_back({nums[i], nums[j], nums[k]});
                        while (j < nums.size() - 1 && nums[j + 1] == nums[j]) {
                            j++;
                        }
                        j++;
                        while (k > 0 && nums[k - 1] == nums[k]) {
                            k--;
                        }
                        k--;
                    } else if (nums[j] + nums[k] < -nums[i]) {
                        while (j < nums.size() - 1 && nums[j + 1] == nums[j]) {
                            j++;
                        }
                        j++;
                    } else {
                        while (k > 0 && nums[k - 1] == nums[k]) {
                            k--;
                        }
                        k--;
                    }
                }

            } else {
                continue;
            }
        }

        return ans;
    }
};
```

---

### 42. 接雨水
**类型**：多种解法（包含双指针）

**解析**：
雨水的多少取决于当前位置左右两边的最高墙的较小值与当前位置墙的高度之差。
暴力解法需要对每个位置遍历寻找左右最大值，复杂度 O(N²)，不可接受。

#### 方法 1：动态规划
使用两个数组预处理存储每个位置左边和右边的最大高度，将寻找最大值的时间降为 O(1)。
*   `LeftMax[i] = max(LeftMax[i-1], height[i])`
*   `RightMax[i] = max(RightMax[i+1], height[i])`
*   最后遍历计算 `ans += min(LeftMax[i], RightMax[i]) - height[i]`

```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        if (height.size() < 2) return 0;
        
        int n = height.size();
        vector<int> L(n, height[0]);
        vector<int> R(n, height[n - 1]);

        for (int i = 1; i < n; i++) L[i] = max(height[i], L[i - 1]);
        for (int j = n - 2; j >= 0; j--) R[j] = max(height[j], R[j + 1]);

        int ans = 0;
        for (int i = 1; i < n - 1; i++) {
            ans += max(0, min(L[i], R[i]) - height[i]);
        }
        return ans;
    }
};
```

#### 方法 2：双指针
动态规划使用了 O(N) 的空间。利用双指针可以将空间复杂度优化到 O(1)。

**原理**：
维护左右两个指针 `left` 和 `right`，以及 `leftMax` 和 `rightMax`。
*   当 `height[left] < height[right]` 时，必有 `leftMax < rightMax`（至少对于当前 left 来说，右边有个更高的挡着）。此时 `left` 处的接水量由 `leftMax` 决定。
*   反之亦然。

```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0;
        int ans = 0;
        while (left < right) {
            leftMax = max(leftMax, height[left]);
            rightMax = max(rightMax, height[right]);
            if (height[left] < height[right]) {
                ans += leftMax - height[left];
                left++;
            } else {
                ans += rightMax - height[right];
                right--;
            }
        }
        return ans;
    }
};
```

#### 方法 3：单调栈
感觉是对于物理现象的一个很好的模拟。
单调栈法的核心是维护一个**单调递减栈**（栈底大、栈顶小），栈里存放下标。
当遇到一个比栈顶高度大的元素时，说明形成了一个“凹槽”：
*   **当前元素**：凹槽右边界
*   **栈顶元素**：凹槽底部（弹出处理）
*   **新栈顶元素**：凹槽左边界

计算水量 = `(min(左边界高, 右边界高) - 底部高) * 宽度`。

```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        stack<int> st;
        int ans = 0;
        for (int i = 0; i < height.size(); i++) {
            while (!st.empty() && height[i] > height[st.top()]) {
                int top = st.top();
                st.pop();
                if (st.empty()) break;
                
                int left = st.top();
                int w = i - left - 1;
                int h = min(height[left], height[i]) - height[top];
                ans += w * h;
            }
            st.push(i);
        }
        return ans;
    }
};
```
