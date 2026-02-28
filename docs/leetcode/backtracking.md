# 回溯

### 46 全排列
哎这题竟然不会了，好像高中的时候还做过的，看答案继续学习吧
感觉思路就是要找到一种有序且不遗漏的方法来遍历
本题中即为从左到右每次固定一个数，剩下的数继续递归，但是有点新意的是如何保证固定的数是未被交换过的，一种方法是使用一个布尔数组来记录，另一种方法是直接交换数组中的数来保证不重复，第二种更省一点空间，👍

```cpp
class Solution {
public:
    vector<vector<int>> ans;
    vector<vector<int>> permute(vector<int>& nums) {
        backtrack(0,nums,nums);
        return ans;
    }

    void backtrack(int first, vector<int>& nums, vector<int>& output) {
        int n = nums.size();
        if (first == n) {
            ans.push_back(output);
            return;
        } else {
            for (int i = first; i < n; i++) {
                swap(output[first], output[i]);
                backtrack(first+1,nums,output);
                swap(output[first], output[i]);
            }
        }
    }
};
```


### 78 子集

其实观察示例的数据可以看出一些端倪，思路就是不断的递归增加，每次把答案的取出，每个加上当前的字符再放回去
但是要注意放回去的时候不要边取边放，不然会无限长了，之前一直查不出这个错误
```cpp
class Solution {
public:
    vector<vector<int>> ans;
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<int> temp_ans;
        // 先把空集给进去
        ans.push_back(temp_ans);
        back(0, nums);
        return ans;
    }
    void back(int number, vector<int>& nums) {
        int n = nums.size();
        if (number >= n) {
            //cout<< "over"<<endl;
            return;
        } else {
            vector<vector<int>> temp_ans;
            for (int i = 0; i < ans.size(); i++) {
                vector<int> temp = ans[i];
                temp.push_back(nums[number]);
                temp_ans.push_back(temp);
                
            }
            for (int j = 0 ; j< temp_ans.size();j++){
                ans.push_back(temp_ans[j]);
            }
            back(number + 1, nums);
        }
    }
};
```